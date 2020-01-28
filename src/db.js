const users = [
    {
        id: 'ndvdy12',
        name: 'Omobolanle Aro',
        email: 'omobolanlearo@gmail.com',
        age: 23
    },
    {
        id: 'hehe738',
        name: 'Busolami',
        email: 'busolami@gmail.com',
        age: 22
    },
]

const posts = [
    {
        id: 'uu3y3bdg',
        title: 'Post',
        body: 'First Body',
        published: true,
        author: 'ndvdy12'
    },
    {
        id: '3eueh733',
        title: 'Second Post',
        body: 'Second Body',
        published: true,
        author: 'ndvdy12'
    },
    {
        id: 'sjj37363',
        title: 'Third Post',
        body: 'Third Body',
        published: true,
        author: 'hehe738'
    }
]

const comments = [
    {
        id: "dueet22",
        author: "hehe738",
        post: "uu3y3bdg",
        text: "First Comment"
    },
    {
        id: "37sb382",
        author: "hehe738",
        post: "3eueh733",
        text: "Second Comment"
    },
    {
        id: "2db8392",
        author: "ndvdy12",
        post: "sjj37363",
        text: "Third Comment"
    },
    {
        id: "2db3832",
        author: "ndvdy12",
        post: "sjj37363",
        text: "Fourth Comment"
    },
]

const db = {
    users,
    posts,
    comments
}

export default db;