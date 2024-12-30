import { ChatType } from "../enums/ChatType.js";
import { MemberStatus } from "../enums/MemberStatus.js";

class MessageService {
  constructor() {
    this.violationCounts = {};
  }

  #isAdminOrOwner(status) {
    if (!status) return false;
    return status === MemberStatus.ADMIN || status === MemberStatus.CREATOR;
  }

  #isGroupOrSuperGroup(type) {
    if (!type) return false;
    return type === ChatType.GROUP || type === ChatType.SUPER_GROUP;
  }

  async handleUnWantedContent(ctx, contentType) {
    if (this.#isGroupOrSuperGroup(ctx.chat.type)) {
      const chatMember = await ctx.getChatMember(ctx.from.id);
      const isAdminOrOwner = this.#isAdminOrOwner(chatMember.status);
      if (!isAdminOrOwner) {
        try {
          await ctx.deleteMessage();
          const userId = ctx.from.id;
          this.violationCounts[userId] = (this.violationCounts[userId] || 0) + 1;
          await ctx.reply(
            `${ctx.from.first_name}, bu ${contentType} kontentga ruxsat berilmagan! (Buzilish soni: ${this.violationCounts[userId]})`
          );

          if (this.violationCounts[userId] > 3) {
            await ctx.banChatMember(userId); // Guruhdan chiqarish
            await ctx.reply(
              `${ctx.from.first_name}, siz 3 martadan ko'p qoidalarni buzganingiz uchun guruhdan chiqarildingiz.`
            );
            delete this.violationCounts[userId]; // Hisobni tozalash
          }
        } catch (err) {
          console.error("Xabarni o'chirishda xatolik:", err);
        }
      }
    }
  }
}

export default MessageService;
