function validateEditData(title, body, userId, postId) {
    if (!title || title.trim() === '') {
        return { valid: false, message: 'Title cannot be empty.'}
    }

    if (!body || body.trim() === '') {
        return { valid: false, message: 'Body cannot be empty.'}
    }

    const userIdInt = parseInt(userId, 10)
    const postIdInt = parseInt(postId, 10)
    if (isNaN(userIdInt) || isNaN(postIdInt) || userIdInt <= 0 || postIdInt <= 0) {
        return { valid: false, message: 'ID must be a positive integer.'}
    }

    return {
        valid: true,
        message: 'Data edited successfully!',
        postData : { title, body, userIdInt, postIdInt }
    }
}

module.exports = validateEditData