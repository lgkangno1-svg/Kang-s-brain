export type LedgerEntryKind = "grant" | "reserve" | "capture" | "release" | "refund";

export type LedgerEntry = Readonly<{
  id: string;
  sequence: number;
  kind: LedgerEntryKind;
  amount: number;
  availableDelta: number;
  reservedDelta: number;
  spentDelta: number;
  idempotencyKey: string;
  reference: string;
  parentEntryId?: string;
}>;

export type CreditReservation = Readonly<{
  reservationEntryId: string;
  usageId: string;
  feature: string;
  reservedAmount: number;
  capturedAmount: number;
  releasedAmount: number;
  status: "active" | "closed";
}>;

export type CreditCapture = Readonly<{
  captureEntryId: string;
  reservationEntryId: string;
  capturedAmount: number;
  refundedAmount: number;
}>;

export type IdempotencyRecord = Readonly<{
  key: string;
  fingerprint: string;
  resultEntryId: string;
}>;

export type WalletState = Readonly<{
  walletId: string;
  nextEntrySequence: number;
  entries: readonly LedgerEntry[];
  reservations: readonly CreditReservation[];
  captures: readonly CreditCapture[];
  idempotency: readonly IdempotencyRecord[];
}>;

export type WalletBalance = Readonly<{
  available: number;
  reserved: number;
  spent: number;
  totalGranted: number;
}>;

export type GrantCommand = Readonly<{
  type: "grant";
  amount: number;
  idempotencyKey: string;
  source: "verified_payment" | "promotion" | "admin";
  reference: string;
}>;

export type ReserveCommand = Readonly<{
  type: "reserve";
  amount: number;
  idempotencyKey: string;
  usageId: string;
  feature: string;
}>;

export type CaptureCommand = Readonly<{
  type: "capture";
  reservationEntryId: string;
  amount?: number;
  idempotencyKey: string;
  usageId: string;
}>;

export type ReleaseCommand = Readonly<{
  type: "release";
  reservationEntryId: string;
  amount?: number;
  idempotencyKey: string;
  reason: string;
}>;

export type RefundCommand = Readonly<{
  type: "refund";
  captureEntryId: string;
  amount?: number;
  idempotencyKey: string;
  reason: string;
}>;

export type WalletCommand = GrantCommand | ReserveCommand | CaptureCommand | ReleaseCommand | RefundCommand;

export type WalletCommandResult = Readonly<{
  state: WalletState;
  entry: LedgerEntry;
  replayed: boolean;
}>;

export function createEmptyWallet(walletId: string): WalletState {
  const normalized = walletId.trim();
  if (!normalized) throw new Error("walletId is required");
  return {
    walletId: normalized,
    nextEntrySequence: 1,
    entries: [],
    reservations: [],
    captures: [],
    idempotency: [],
  };
}

function assertPositiveCredits(amount: number, label = "amount"): void {
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error(`${label} must be a positive safe integer number of credits`);
  }
}

function assertText(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${label} is required`);
  return normalized;
}

function commandFingerprint(command: WalletCommand): string {
  switch (command.type) {
    case "grant":
      return JSON.stringify([command.type, command.amount, command.source, command.reference]);
    case "reserve":
      return JSON.stringify([command.type, command.amount, command.usageId, command.feature]);
    case "capture":
      return JSON.stringify([command.type, command.reservationEntryId, command.amount ?? null, command.usageId]);
    case "release":
      return JSON.stringify([command.type, command.reservationEntryId, command.amount ?? null, command.reason]);
    case "refund":
      return JSON.stringify([command.type, command.captureEntryId, command.amount ?? null, command.reason]);
  }
}

export function getWalletBalance(state: WalletState): WalletBalance {
  const balance = state.entries.reduce(
    (current, entry) => ({
      available: current.available + entry.availableDelta,
      reserved: current.reserved + entry.reservedDelta,
      spent: current.spent + entry.spentDelta,
    }),
    {available: 0, reserved: 0, spent: 0},
  );
  const totalGranted = state.entries
    .filter((entry) => entry.kind === "grant")
    .reduce((sum, entry) => sum + entry.amount, 0);

  if (balance.available < 0 || balance.reserved < 0 || balance.spent < 0) {
    throw new Error("wallet invariant violated: a balance bucket became negative");
  }
  if (balance.available + balance.reserved + balance.spent !== totalGranted) {
    throw new Error("wallet invariant violated: ledger credits do not reconcile to total grants");
  }

  return {...balance, totalGranted};
}

function findEntry(state: WalletState, entryId: string): LedgerEntry {
  const entry = state.entries.find((candidate) => candidate.id === entryId);
  if (!entry) throw new Error(`Unknown ledger entry: ${entryId}`);
  return entry;
}

function findReservation(state: WalletState, reservationEntryId: string): CreditReservation {
  const reservation = state.reservations.find((candidate) => candidate.reservationEntryId === reservationEntryId);
  if (!reservation) throw new Error(`Unknown reservation: ${reservationEntryId}`);
  return reservation;
}

function findCapture(state: WalletState, captureEntryId: string): CreditCapture {
  const capture = state.captures.find((candidate) => candidate.captureEntryId === captureEntryId);
  if (!capture) throw new Error(`Unknown capture: ${captureEntryId}`);
  return capture;
}

function remainingReservation(reservation: CreditReservation): number {
  return reservation.reservedAmount - reservation.capturedAmount - reservation.releasedAmount;
}

function appendEntry(
  state: WalletState,
  command: WalletCommand,
  input: Omit<LedgerEntry, "id" | "sequence" | "idempotencyKey">,
): {state: WalletState; entry: LedgerEntry} {
  const sequence = state.nextEntrySequence;
  const entry: LedgerEntry = {
    ...input,
    id: `credit-${sequence}`,
    sequence,
    idempotencyKey: command.idempotencyKey,
  };
  return {
    entry,
    state: {
      ...state,
      nextEntrySequence: sequence + 1,
      entries: [...state.entries, entry],
    },
  };
}

function updateReservation(state: WalletState, updated: CreditReservation): WalletState {
  return {
    ...state,
    reservations: state.reservations.map((item) => item.reservationEntryId === updated.reservationEntryId ? updated : item),
  };
}

function updateCapture(state: WalletState, updated: CreditCapture): WalletState {
  return {
    ...state,
    captures: state.captures.map((item) => item.captureEntryId === updated.captureEntryId ? updated : item),
  };
}

function finalizeIdempotency(state: WalletState, key: string, fingerprint: string, resultEntryId: string): WalletState {
  return {...state, idempotency: [...state.idempotency, {key, fingerprint, resultEntryId}]};
}

export function applyWalletCommand(state: WalletState, command: WalletCommand): WalletCommandResult {
  const idempotencyKey = assertText(command.idempotencyKey, "idempotencyKey");
  const fingerprint = commandFingerprint(command);
  const previous = state.idempotency.find((record) => record.key === idempotencyKey);
  if (previous) {
    if (previous.fingerprint !== fingerprint) throw new Error(`Idempotency key conflict: ${idempotencyKey}`);
    return {state, entry: findEntry(state, previous.resultEntryId), replayed: true};
  }

  let nextState = state;
  let entry: LedgerEntry;

  switch (command.type) {
    case "grant": {
      assertPositiveCredits(command.amount);
      assertText(command.reference, "reference");
      ({state: nextState, entry} = appendEntry(state, command, {kind: "grant", amount: command.amount, availableDelta: command.amount, reservedDelta: 0, spentDelta: 0, reference: `${command.source}:${command.reference}`}));
      break;
    }
    case "reserve": {
      assertPositiveCredits(command.amount);
      assertText(command.usageId, "usageId");
      assertText(command.feature, "feature");
      if (getWalletBalance(state).available < command.amount) throw new Error("Insufficient available credits");
      ({state: nextState, entry} = appendEntry(state, command, {kind: "reserve", amount: command.amount, availableDelta: -command.amount, reservedDelta: command.amount, spentDelta: 0, reference: `${command.feature}:${command.usageId}`}));
      nextState = {...nextState, reservations: [...nextState.reservations, {reservationEntryId: entry.id, usageId: command.usageId, feature: command.feature, reservedAmount: command.amount, capturedAmount: 0, releasedAmount: 0, status: "active"}]};
      break;
    }
    case "capture": {
      assertText(command.usageId, "usageId");
      const reservation = findReservation(state, command.reservationEntryId);
      if (reservation.status !== "active") throw new Error("Reservation is already closed");
      if (reservation.usageId !== command.usageId) throw new Error("Capture usageId does not match reservation");
      const remaining = remainingReservation(reservation);
      const amount = command.amount ?? remaining;
      assertPositiveCredits(amount);
      if (amount > remaining) throw new Error("Capture exceeds remaining reserved credits");
      ({state: nextState, entry} = appendEntry(state, command, {kind: "capture", amount, availableDelta: 0, reservedDelta: -amount, spentDelta: amount, reference: command.usageId, parentEntryId: reservation.reservationEntryId}));
      nextState = updateReservation(nextState, {...reservation, capturedAmount: reservation.capturedAmount + amount, status: amount === remaining ? "closed" : "active"});
      nextState = {...nextState, captures: [...nextState.captures, {captureEntryId: entry.id, reservationEntryId: reservation.reservationEntryId, capturedAmount: amount, refundedAmount: 0}]};
      break;
    }
    case "release": {
      assertText(command.reason, "reason");
      const reservation = findReservation(state, command.reservationEntryId);
      if (reservation.status !== "active") throw new Error("Reservation is already closed");
      const remaining = remainingReservation(reservation);
      const amount = command.amount ?? remaining;
      assertPositiveCredits(amount);
      if (amount > remaining) throw new Error("Release exceeds remaining reserved credits");
      ({state: nextState, entry} = appendEntry(state, command, {kind: "release", amount, availableDelta: amount, reservedDelta: -amount, spentDelta: 0, reference: command.reason, parentEntryId: reservation.reservationEntryId}));
      nextState = updateReservation(nextState, {...reservation, releasedAmount: reservation.releasedAmount + amount, status: amount === remaining ? "closed" : "active"});
      break;
    }
    case "refund": {
      assertText(command.reason, "reason");
      const capture = findCapture(state, command.captureEntryId);
      const remaining = capture.capturedAmount - capture.refundedAmount;
      const amount = command.amount ?? remaining;
      assertPositiveCredits(amount);
      if (amount > remaining) throw new Error("Refund exceeds unrefunded captured credits");
      ({state: nextState, entry} = appendEntry(state, command, {kind: "refund", amount, availableDelta: amount, reservedDelta: 0, spentDelta: -amount, reference: command.reason, parentEntryId: capture.captureEntryId}));
      nextState = updateCapture(nextState, {...capture, refundedAmount: capture.refundedAmount + amount});
      break;
    }
  }

  nextState = finalizeIdempotency(nextState, idempotencyKey, fingerprint, entry.id);
  getWalletBalance(nextState);
  return {state: nextState, entry, replayed: false};
}

export function assertWalletInvariants(state: WalletState): WalletBalance {
  const ids = new Set<string>();
  for (const entry of state.entries) {
    if (ids.has(entry.id)) throw new Error(`Duplicate ledger entry id: ${entry.id}`);
    ids.add(entry.id);
    assertPositiveCredits(entry.amount, "ledger entry amount");
  }
  const idempotencyKeys = new Set<string>();
  for (const record of state.idempotency) {
    if (idempotencyKeys.has(record.key)) throw new Error(`Duplicate idempotency key: ${record.key}`);
    idempotencyKeys.add(record.key);
    findEntry(state, record.resultEntryId);
  }
  for (const reservation of state.reservations) {
    if (findEntry(state, reservation.reservationEntryId).kind !== "reserve") throw new Error("Reservation must point to a reserve ledger entry");
    if (reservation.capturedAmount + reservation.releasedAmount > reservation.reservedAmount) throw new Error("Reservation accounting exceeds reserved credits");
    const expectedStatus = remainingReservation(reservation) === 0 ? "closed" : "active";
    if (reservation.status !== expectedStatus) throw new Error("Reservation status does not match remaining credits");
  }
  for (const capture of state.captures) {
    if (findEntry(state, capture.captureEntryId).kind !== "capture") throw new Error("Capture record must point to a capture ledger entry");
    if (capture.refundedAmount > capture.capturedAmount) throw new Error("Capture is over-refunded");
  }
  return getWalletBalance(state);
}
