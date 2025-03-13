const {response} = require("express");

async function getAllPosts() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts')
        if (!response.ok) return null

        const posts = await response.json()

        // get unique user IDs from posts
        const userIds = [...new Set(posts.map(post => post.userId))]

         // fetch all users in parallel
        const users = await Promise.all(
            userIds.map(
                userId => getUserById(userId)
            )
        )

        // map posts and find the username directly
        return posts.map(post => ({
            userId: post.userId,
            username: users.find(user => user.id === post.userId)?.username || 'Unknown',
            id: post.id,
            title: post.title,
            body: post.body
        }))

    } catch (err) {
        console.error(`Error fetching posts : ${err.message}`)
        return null
    }
}

async function getAllUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.error(`Error fetching all users : ${err.message}`)
        return null
    }
}

async function getPostById(id) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
        if (!response.ok) return null

        const post = await response.json()

        // add username to post
        const user = await getUserById(post.userId);
        post.username = user?.username || 'Unknown';

        return post
    } catch (err) {
        console.error(`Error fetching post with id (${id}) : ${err.message}`)
        return null
    }
}

async function getUserPostsByUserId(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`)
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.error(`Error fetching user posts with user id (${userId}) : ${err.message}`)
        return null
    }
}

async function getUserById(id) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.error(`Error fetching user with id (${id}) : ${err.message}`)
        return null
    }
}

async function getCommentsByPostId(postId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
        if (!response.ok) return null
        return await response.json()
    } catch (err) {
        console.error(`Error fetching comments with postId (${postId}) : ${err.message}`)
        return null
    }
}

async function createPost(title, body, userId) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                body: body,
                userId: parseInt(userId, 10),
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })

        return await response.json()
    } catch (err) {
        console.error(`Error posting a post ${err.message}`)
        return null
    }
}


async function updatePost(title, body, userId, postId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: 'POST',
            body: JSON.stringify({
                postId: parseInt(postId, 10),
                title: title,
                body: body,
                userId: parseInt(userId, 10),
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })

        return await response.json()
    } catch (err) {
        console.error(`Error updating a post ${err.message}`)
        return null
    }
}

async function deletePost(postId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: 'DELETE',
        })
        if (!response.ok) return null
        return true;
    } catch (err) {
        console.error(`Error updating a post ${err.message}`)
        return null
    }
}


module.exports = {
    getAllPosts,
    getAllUsers,
    getPostById,
    getUserById,
    getCommentsByPostId,
    getUserPostsByUserId,
    createPost,
    updatePost,
    deletePost
}
