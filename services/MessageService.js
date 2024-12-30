import { MemberStatus } from "../enums/MemberStatus.js";

class MessageService {
  constructor() {
    this.greeting_arrays = [
      "salom",
      "assalomu alaykum",
      "sommakim",
      "slam",
      "hello",
      "hi",
    ];
  }

  // return true or false
  checkMessage(message) {
    if (!message) return false;
    const regex = new RegExp(this.greeting_arrays.join("|"), "i");
    return regex.test(message);
  }

  isAdminOrOwner(status) {
    if (!status) return false;
    return status === MemberStatus.ADMIN || status === MemberStatus.CREATOR;
  }

  isUnwantedContent(message) {
    return (
      message.text?.match(/https?:\/\/[^\s]+/) || // URLni aniqlash
      message.photo || // Rasm
      message.video || // Video
      message.audio || // Audio
      message.document // Hujjat
    );
  }
}

export default MessageService;
