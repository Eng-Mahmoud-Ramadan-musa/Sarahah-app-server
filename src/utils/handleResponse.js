export function handleResponse(data) {
  return data.map(msg => {
    const message = msg._doc ? msg._doc : msg;

    if (message.hidden) {
      return {
        ...message,
        _id: message._id?.toString?.(),
        sender: {
          userName: 'Unknown User',
          email: '',
          image: {
            secure_url: 'https://res.cloudinary.com/dbxgg2ebo/image/upload/v1752579004/secret_hvciz7.png'
          }
        }
      };
    }

    return {
      ...message,
      _id: message._id?.toString?.()
    };
  });
}
