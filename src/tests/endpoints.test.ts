describe('API', () => {
  const baseUrl = 'http://localhost:4000/api'

  let createdUserId: string

  test('GET api/users should return an empty array', async () => {
    const response = await fetch(`${baseUrl}/users`)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual([])
  })

  test('POST api/users should return a response containing newly created record', async () => {
    const newUser = {
      username: 'John',
      age: 21,
      hobbies: ['test']
    }

    const response = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })

    const data = await response.json()

    expect(response.status).toBe(201)

    expect(data).toHaveProperty('id')

    expect(data.username).toBe(newUser.username)
    expect(data.age).toBe(newUser.age)
    expect(data.hobbies).toEqual(newUser.hobbies)

    createdUserId = data.id
  })

  test('GET api/user/{userId} should return the created record', async () => {
    const response = await fetch(`${baseUrl}/users/${createdUserId}`)
    const data = await response.json()

    expect(response.status).toBe(200)

    expect(data.id).toBe(createdUserId)
    expect(data.username).toBe('John')
    expect(data.age).toBe(21)
    expect(data.hobbies).toEqual(['test'])
  })
})
