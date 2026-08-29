import type {WalletCommand} from "./ledger";

export type CreditSystemRole = "payment_webhook" | "feature_executor" | "promotion_service" | "support_admin";

export type CreditActor =
  | Readonly<{kind: "account"; accountId: string}>
  | Readonly<{kind: "system"; role: CreditSystemRole; auditId: string}>;

export type WalletOwnership = Readonly<{
  walletId: string;
  accountId: string;
}>;

export type AuthorizedWalletCommand = Readonly<{
  actorKind: CreditActor["kind"];
  authority: string;
  command: WalletCommand;
}>;

function requireText(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${label} is required`);
  return normalized;
}

function assertAccountOwnsWallet(actor: Extract<CreditActor, {kind: "account"}>, ownership: WalletOwnership): void {
  const actorAccountId = requireText(actor.accountId, "actor.accountId");
  const ownerAccountId = requireText(ownership.accountId, "ownership.accountId");
  requireText(ownership.walletId, "ownership.walletId");
  if (actorAccountId !== ownerAccountId) throw new Error("Wallet access denied: account does not own wallet");
}

function assertSystemActor(actor: CreditActor): Extract<CreditActor, {kind: "system"}> {
  if (actor.kind !== "system") throw new Error("System authority required");
  requireText(actor.auditId, "actor.auditId");
  return actor;
}

export function authorizeWalletCommand(
  ownership: WalletOwnership,
  actor: CreditActor,
  command: WalletCommand,
): AuthorizedWalletCommand {
  requireText(ownership.walletId, "ownership.walletId");
  requireText(ownership.accountId, "ownership.accountId");

  switch (command.type) {
    case "grant": {
      const system = assertSystemActor(actor);
      const allowedRole = command.source === "verified_payment"
        ? "payment_webhook"
        : command.source === "promotion"
          ? "promotion_service"
          : "support_admin";
      if (system.role !== allowedRole) {
        throw new Error(`Grant authority denied: ${command.source} requires ${allowedRole}`);
      }
      return {actorKind: "system", authority: `${system.role}:${system.auditId}`, command};
    }
    case "reserve": {
      if (actor.kind !== "account") throw new Error("Reserve authority denied: account owner required");
      assertAccountOwnsWallet(actor, ownership);
      return {actorKind: "account", authority: `account:${actor.accountId}`, command};
    }
    case "capture":
    case "release": {
      const system = assertSystemActor(actor);
      if (system.role !== "feature_executor" && system.role !== "support_admin") {
        throw new Error(`${command.type} authority denied: feature_executor or support_admin required`);
      }
      return {actorKind: "system", authority: `${system.role}:${system.auditId}`, command};
    }
    case "refund": {
      const system = assertSystemActor(actor);
      if (system.role !== "feature_executor" && system.role !== "support_admin") {
        throw new Error("Refund authority denied: feature_executor or support_admin required");
      }
      return {actorKind: "system", authority: `${system.role}:${system.auditId}`, command};
    }
  }
}
