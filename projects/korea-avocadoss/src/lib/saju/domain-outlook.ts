import type {SajuRelation} from './reading';
import type {TenGod} from './ten-gods';

export type SajuLocale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
export type DomainOutlook={theme:string;work:string;money:string;relationships:string;pace:string;focus:string;caution:string};

const GOD:Record<SajuLocale,Record<TenGod,string>>={
 en:{peer:'Peer',robWealth:'Rob Wealth',eatingGod:'Eating God',hurtingOfficer:'Hurting Officer',indirectWealth:'Indirect Wealth',directWealth:'Direct Wealth',sevenKillings:'Seven Killings',directOfficer:'Direct Officer',indirectResource:'Indirect Resource',directResource:'Direct Resource'},
 'zh-CN':{peer:'比肩',robWealth:'劫财',eatingGod:'食神',hurtingOfficer:'伤官',indirectWealth:'偏财',directWealth:'正财',sevenKillings:'七杀',directOfficer:'正官',indirectResource:'偏印',directResource:'正印'},
 ja:{peer:'比肩',robWealth:'劫財',eatingGod:'食神',hurtingOfficer:'傷官',indirectWealth:'偏財',directWealth:'正財',sevenKillings:'七殺',directOfficer:'正官',indirectResource:'偏印',directResource:'印綬'},
 'zh-TW':{peer:'比肩',robWealth:'劫財',eatingGod:'食神',hurtingOfficer:'傷官',indirectWealth:'偏財',directWealth:'正財',sevenKillings:'七殺',directOfficer:'正官',indirectResource:'偏印',directResource:'正印'},
 vi:{peer:'Tỷ Kiên',robWealth:'Kiếp Tài',eatingGod:'Thực Thần',hurtingOfficer:'Thương Quan',indirectWealth:'Thiên Tài',directWealth:'Chính Tài',sevenKillings:'Thất Sát',directOfficer:'Chính Quan',indirectResource:'Thiên Ấn',directResource:'Chính Ấn'},
 th:{peer:'เพื่อนร่วมธาตุ',robWealth:'คู่แข่งทรัพย์',eatingGod:'การสร้างผลงาน',hurtingOfficer:'การแสดงออกอิสระ',indirectWealth:'โอกาสทรัพย์',directWealth:'ทรัพย์แบบมีระบบ',sevenKillings:'แรงกดดันท้าทาย',directOfficer:'โครงสร้างและหน้าที่',indirectResource:'การเรียนรู้นอกกรอบ',directResource:'การสนับสนุนและการเรียนรู้'}
};

const R:Record<SajuLocale,Record<SajuRelation,Omit<DomainOutlook,'theme'>>>= {
 en:{
  reinforce:{work:'Self-directed work and peer dynamics become more visible. Own a clear lane instead of competing everywhere.',money:'Keep spending and shared-resource boundaries explicit; symbolic momentum is not a reason to take financial risk.',relationships:'Independence is strong. State needs clearly and leave room for the other person to do the same.',pace:'Energy can feel assertive and fast; schedule recovery before friction builds.',focus:'Choose fewer priorities you can personally own.',caution:'Watch competitiveness, stubbornness and duplicated effort.'},
  support:{work:'Learning, preparation, mentors and foundation-building are favored themes.',money:'Prefer reserves, planning and information gathering over impulsive commitments.',relationships:'Supportive people may matter more than visibility; ask for help before strain accumulates.',pace:'A steadier, restorative rhythm is more useful than forcing speed.',focus:'Build foundations and improve one skill deeply.',caution:'Comfort can turn into delay or excessive dependence on preparation.'},
  expression:{work:'Output, presentation, teaching, travel and making ideas tangible are highlighted.',money:'Value may come from clearer output and communication, but keep pricing and obligations concrete.',relationships:'Direct expression helps, provided tone and timing are considered.',pace:'Creative momentum can run high; leave buffer for revisions and sleep.',focus:'Finish and show a real piece of work.',caution:'Overpromising or speaking before checking details can create rework.'},
  opportunity:{work:'Execution, negotiation and converting effort into practical results are emphasized.',money:'Resource management is a central theme; track cash, time and commitments instead of relying on luck.',relationships:'Practical expectations and reciprocity benefit from explicit agreements.',pace:'A productive rhythm works best when limits are measurable.',focus:'Turn one opportunity into a concrete, trackable outcome.',caution:'Do not treat a symbolic reading as investment advice or justification for oversized risk.'},
  pressure:{work:'Responsibility, rules, deadlines and leadership tests may feel more prominent.',money:'Protect downside, document obligations and avoid pressure-driven decisions.',relationships:'Boundaries and reliability matter more than dramatic gestures.',pace:'Pressure can accumulate quietly; reduce avoidable load and use routines.',focus:'Use structure and preparation to turn pressure into progress.',caution:'Do not interpret every obstacle as fate; ask for support when load becomes excessive.'}
 },
 'zh-CN':{
  reinforce:{work:'自主推进与同辈互动更突出，适合明确自己的责任范围。',money:'把个人与共同资源边界说清楚，不要因“运势”承担额外金融风险。',relationships:'独立性较强，清楚表达需求，也给对方空间。',pace:'节奏容易加快，提前安排休息。',focus:'减少目标，专注自己能持续负责的事项。',caution:'留意竞争、固执与重复消耗。'},
  support:{work:'学习、准备、导师与基础建设是更重要的主题。',money:'优先储备、计划与信息整理，少做冲动承诺。',relationships:'支持型关系更重要，需要时主动求助。',pace:'稳定恢复比强行提速更有利。',focus:'打基础，并深入提升一项技能。',caution:'避免把准备变成拖延。'},
  expression:{work:'表达、输出、展示、教学与旅行体验更突出。',money:'清晰产出有助于创造价值，但价格与义务仍要具体确认。',relationships:'直接沟通有帮助，同时注意语气和时机。',pace:'创作动能较高，要给修改与睡眠留余量。',focus:'完成并公开一个真实成果。',caution:'避免未经确认就承诺过多。'},
  opportunity:{work:'执行、协商与把努力转成成果是重点。',money:'资源管理更关键，记录现金、时间与承诺，不依赖好运。',relationships:'明确互惠与实际期待更有帮助。',pace:'可衡量的节奏比盲目加速更稳。',focus:'把一个机会转化为可跟踪结果。',caution:'不要把象征性运势当作投资建议。'},
  pressure:{work:'责任、规则、期限与承担角色的主题更明显。',money:'先保护下行风险，记录义务，避免压力下做决定。',relationships:'可靠与边界比夸张表达更重要。',pace:'压力可能累积，减少可避免负担并建立规律。',focus:'用结构和准备把压力转成进度。',caution:'不要把所有阻力解释成命运，必要时寻求支持。'}
 },
 ja:{
  reinforce:{work:'自分主導の仕事と同輩との関係が目立ちやすい時期です。担当領域を明確に。',money:'自分と共有資源の境界を明確にし、運勢を理由に金融リスクを増やさない。',relationships:'自立性が強まりやすいので、互いの要望と余白を言葉にする。',pace:'勢いが出やすいぶん、休息を先に予定する。',focus:'自分で責任を持てる優先事項を絞る。',caution:'競争心、頑固さ、重複作業に注意。'},
  support:{work:'学習、準備、メンター、基礎づくりが中心テーマ。',money:'衝動的な約束より、備えと情報整理を優先。',relationships:'支えてくれる人との関係を大切にし、必要なら早めに頼る。',pace:'無理に速めず、回復できる安定したペースを。',focus:'土台を整え、一つの技能を深める。',caution:'準備が先延ばしに変わらないようにする。'},
  expression:{work:'発信、制作、説明、旅、アイデアの具体化が目立つ。',money:'明確な成果物が価値につながりやすいが、条件は具体的に確認。',relationships:'率直な表現が役立つが、タイミングと語調に配慮。',pace:'創作の勢いが出やすいので修正と睡眠の余白を確保。',focus:'実際の成果物を一つ完成させて見せる。',caution:'確認前の約束を増やしすぎない。'},
  opportunity:{work:'実行、交渉、努力を成果へ変えることが焦点。',money:'資源管理が重要。現金、時間、約束を記録し、運任せにしない。',relationships:'現実的な期待と相互性を明確にする。',pace:'測れる範囲で生産性を上げる。',focus:'一つの機会を追跡できる成果に変える。',caution:'象徴的な運勢を投資助言として扱わない。'},
  pressure:{work:'責任、規則、締切、役割を引き受けるテーマが強まりやすい。',money:'下振れを守り、義務を記録し、圧力下の判断を避ける。',relationships:'派手さより境界線と信頼性が重要。',pace:'負荷が蓄積しやすいので、減らせる仕事を減らす。',focus:'構造と準備で圧力を進捗に変える。',caution:'すべての障害を運命と解釈せず、必要なら助けを求める。'}
 },
 'zh-TW':{
  reinforce:{work:'自主推進與同儕互動較突出，適合明確自己的責任範圍。',money:'把個人與共享資源界線說清楚，不要因「運勢」承擔額外金融風險。',relationships:'獨立性較強，清楚表達需求，也保留對方空間。',pace:'節奏容易加快，提前安排休息。',focus:'減少目標，專注自己能持續負責的事項。',caution:'留意競爭、固執與重複消耗。'},
  support:{work:'學習、準備、導師與基礎建設是重要主題。',money:'優先儲備、計畫與資訊整理，少做衝動承諾。',relationships:'支持型關係更重要，需要時主動求助。',pace:'穩定恢復比強行提速更有利。',focus:'打好基礎，深入提升一項技能。',caution:'避免把準備變成拖延。'},
  expression:{work:'表達、產出、展示、教學與旅行體驗更突出。',money:'清楚產出有助創造價值，但價格與義務仍需具體確認。',relationships:'直接溝通有幫助，同時注意語氣與時機。',pace:'創作動能較高，要為修改與睡眠留餘量。',focus:'完成並展示一個真實成果。',caution:'避免未確認細節就承諾過多。'},
  opportunity:{work:'執行、協商與把努力轉成成果是重點。',money:'資源管理更關鍵，記錄現金、時間與承諾，不依賴好運。',relationships:'明確互惠與實際期待更有幫助。',pace:'可衡量的節奏比盲目加速更穩。',focus:'把一個機會轉化為可追蹤成果。',caution:'不要把象徵性運勢當作投資建議。'},
  pressure:{work:'責任、規則、期限與承擔角色的主題更明顯。',money:'先保護下行風險，記錄義務，避免壓力下決策。',relationships:'可靠與界線比誇張表達更重要。',pace:'壓力可能累積，減少可避免負擔並建立規律。',focus:'用結構和準備把壓力轉成進度。',caution:'不要把所有阻力解讀成命運，必要時尋求支持。'}
 },
 vi:{
  reinforce:{work:'Tính tự chủ và tương tác với người ngang hàng nổi bật hơn; hãy xác định rõ phần việc mình sở hữu.',money:'Làm rõ ranh giới tài nguyên cá nhân/chung và không tăng rủi ro tài chính vì “vận”.',relationships:'Nhu cầu độc lập mạnh hơn; nói rõ nhu cầu và chừa không gian cho nhau.',pace:'Nhịp có thể nhanh; lên lịch nghỉ trước khi căng thẳng tích tụ.',focus:'Giảm số ưu tiên và chọn việc bạn có thể tự chịu trách nhiệm.',caution:'Coi chừng cạnh tranh, cố chấp và công việc trùng lặp.'},
  support:{work:'Học hỏi, chuẩn bị, người hướng dẫn và xây nền là chủ đề chính.',money:'Ưu tiên dự phòng, kế hoạch và thu thập thông tin hơn cam kết bốc đồng.',relationships:'Người hỗ trợ quan trọng; hãy nhờ giúp trước khi quá tải.',pace:'Nhịp ổn định và hồi phục hữu ích hơn ép tốc độ.',focus:'Xây nền và đào sâu một kỹ năng.',caution:'Đừng để chuẩn bị biến thành trì hoãn.'},
  expression:{work:'Biểu đạt, sản xuất, trình bày, du lịch và biến ý tưởng thành việc thật nổi bật.',money:'Đầu ra rõ có thể tạo giá trị, nhưng giá và nghĩa vụ phải cụ thể.',relationships:'Giao tiếp thẳng giúp ích nếu chú ý giọng điệu và thời điểm.',pace:'Động lực sáng tạo cao; chừa thời gian sửa và ngủ.',focus:'Hoàn thành và đưa ra một sản phẩm thật.',caution:'Tránh hứa quá nhiều trước khi kiểm tra chi tiết.'},
  opportunity:{work:'Thực thi, thương lượng và chuyển nỗ lực thành kết quả là trọng tâm.',money:'Quản lý nguồn lực là chủ đề lớn; theo dõi tiền, thời gian và cam kết thay vì dựa vào may mắn.',relationships:'Kỳ vọng thực tế và tính có đi có lại nên được nói rõ.',pace:'Nhịp có thể đo lường sẽ bền hơn chạy hết tốc lực.',focus:'Biến một cơ hội thành kết quả có thể theo dõi.',caution:'Không dùng diễn giải tượng trưng như lời khuyên đầu tư.'},
  pressure:{work:'Trách nhiệm, quy tắc, hạn chót và thử thách vai trò nổi bật hơn.',money:'Bảo vệ rủi ro giảm, ghi rõ nghĩa vụ và tránh quyết định do áp lực.',relationships:'Ranh giới và độ tin cậy quan trọng hơn cử chỉ lớn.',pace:'Áp lực có thể tích tụ; giảm tải tránh được và dùng thói quen.',focus:'Dùng cấu trúc và chuẩn bị để biến áp lực thành tiến bộ.',caution:'Đừng coi mọi trở ngại là số phận; tìm hỗ trợ khi cần.'}
 },
 th:{
  reinforce:{work:'งานที่ขับเคลื่อนด้วยตนเองและความสัมพันธ์กับเพื่อนร่วมระดับเด่นขึ้น ควรกำหนดขอบเขตงานให้ชัด',money:'แยกทรัพยากรส่วนตัวและส่วนร่วมให้ชัด และอย่าเพิ่มความเสี่ยงทางการเงินเพราะคำทำนาย',relationships:'ความเป็นอิสระเด่นขึ้น ควรสื่อสารความต้องการและให้พื้นที่กัน',pace:'จังหวะอาจเร็วขึ้น ควรวางเวลาพักล่วงหน้า',focus:'ลดจำนวนเป้าหมายและเลือกสิ่งที่รับผิดชอบได้จริง',caution:'ระวังการแข่งขัน ความดื้อ และงานซ้ำซ้อน'},
  support:{work:'การเรียนรู้ การเตรียมตัว ผู้แนะนำ และการสร้างพื้นฐานเป็นธีมหลัก',money:'เน้นเงินสำรอง แผน และข้อมูล มากกว่าการผูกมัดแบบฉับพลัน',relationships:'คนที่สนับสนุนมีความสำคัญ ขอความช่วยเหลือก่อนภาระสะสม',pace:'จังหวะที่มั่นคงและฟื้นตัวได้ดีกว่าการเร่ง',focus:'สร้างพื้นฐานและพัฒนาทักษะหนึ่งอย่างให้ลึก',caution:'อย่าให้การเตรียมตัวกลายเป็นการผัดวัน'},
  expression:{work:'การสร้างผลงาน การนำเสนอ การสอน การเดินทาง และการทำไอเดียให้เป็นรูปธรรมเด่นขึ้น',money:'ผลงานที่ชัดอาจสร้างคุณค่า แต่ราคาและภาระต้องตรวจให้แน่นอน',relationships:'การสื่อสารตรงช่วยได้เมื่อคำนึงถึงน้ำเสียงและเวลา',pace:'แรงสร้างสรรค์สูง ควรเผื่อเวลาสำหรับแก้ไขและนอน',focus:'ทำผลงานจริงหนึ่งชิ้นให้เสร็จและนำเสนอ',caution:'อย่ารับปากมากก่อนตรวจรายละเอียด'},
  opportunity:{work:'การลงมือทำ การเจรจา และเปลี่ยนความพยายามเป็นผลลัพธ์เด่นขึ้น',money:'การจัดการทรัพยากรเป็นธีมสำคัญ ติดตามเงิน เวลา และภาระโดยไม่พึ่งโชค',relationships:'ควรทำความคาดหวังและการตอบแทนซึ่งกันและกันให้ชัด',pace:'จังหวะที่วัดได้ยั่งยืนกว่าการเร่งเต็มกำลัง',focus:'เปลี่ยนโอกาสหนึ่งอย่างเป็นผลลัพธ์ที่ติดตามได้',caution:'อย่าใช้คำทำนายเชิงสัญลักษณ์แทนคำแนะนำการลงทุน'},
  pressure:{work:'ความรับผิดชอบ กฎ เส้นตาย และบทบาทผู้นำเด่นขึ้น',money:'ป้องกันความเสี่ยงขาลง บันทึกภาระ และหลีกเลี่ยงการตัดสินใจภายใต้แรงกดดัน',relationships:'ขอบเขตและความน่าเชื่อถือสำคัญกว่าท่าทีใหญ่โต',pace:'แรงกดดันสะสมได้ ควรลดภาระที่เลี่ยงได้และใช้กิจวัตร',focus:'ใช้โครงสร้างและการเตรียมตัวเปลี่ยนแรงกดดันเป็นความก้าวหน้า',caution:'อย่ามองทุกอุปสรรคเป็นชะตา ขอความช่วยเหลือเมื่อจำเป็น'}
 }
};

export function buildDomainOutlook(locale:SajuLocale,relation:SajuRelation,tenGod:TenGod):DomainOutlook{
 return {theme:GOD[locale][tenGod],...R[locale][relation]};
}
