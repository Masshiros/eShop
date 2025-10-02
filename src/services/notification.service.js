const notificationModel = require("../models/notification.model");

class NotificationService {
  static pushNotification = async ({
    type = "SHOP-001",
    receivedId,
    senderId,
    options = {},
  }) => {
    let noti_contents;
    if (type === "SHOP-001") {
      noti_contents = `@@@ added a new product: @@@@`;
    } else if (type === "PROMOTION-001") {
      noti_contents = `@@@ added a new voucher: @@@@@`;
    }
    const newNoti = await notificationModel({
      noti_type: type,
      noti_senderId: senderId,
      noti_receivedId: receivedId,
      noti_options: options,
      noti_content: noti_contents,
    });
    return newNoti;
  };
}
module.exports = NotificationService