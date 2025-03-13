function validatePostData(title, body, userId) {
    if (!title || title.trim() === '') {
        return { valid: false, message: 'Title cannot be empty.', statusCode: 400 }
    }

    if (!body || body.trim() === '') {
        return { valid: false, message: 'Body cannot be empty.', statusCode: 400 }
    }

    const userIdInt = parseInt(userId, 10)
    if (isNaN(userIdInt) || userIdInt <= 0) {
        return { valid: false, message: 'User ID must be a positive integer.', statusCode: 400 }
    }

    return {
        valid: true,
        statusCode: 200,
        message: 'Data posted successfully!',
        postData : { title, body, userIdInt }
    }
}

module.exports = validatePostData