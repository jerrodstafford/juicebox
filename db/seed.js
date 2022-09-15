const { client, createUser, updateUser, getAllUsers, getUserById, createPost, updatePost, getAllPosts, getPostsByUser } = require('./index');

const dropTables = async() => {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

const createTables = async() => {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location varchar(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `)

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}


const createInitialUsers = async() => {
  try {
    console.log("Starting to create users...");
    
    const albert = await createUser({ username:'albert', password: 'bertie99', name: 'Albert', location: 'Chicago, IL' });
    const sandra = await createUser({ username: 'sandra', password: '2sandy4me', name: 'Sandra', location: 'Denver, CO' });
    const glamgal = await createUser({ username: 'glamgal', password: 'soglam', name: 'Gladys', location: 'New York City, NY' });

    console.log(albert);
    console.log(sandra);
    console.log(glamgal);

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

const createInitialPosts = async () => {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    await createPost({
      authorId: albert.id,
      title: "First Post",
      content: "This is my first post. I hope I love writing blogs as much as I love writing them."
    });

    await createPost({
      authorId: sandra.id,
      title: "Number One",
      content: "Yeah, what Albert said."
    });

    await createPost({
      authorId: glamgal.id,
      title: "Getting Started",
      content: "Yeah, what they both said!"
    });
  } catch (error) {
    throw error;
  }
}

const rebuildDB = async() => {
  try {
    client.connect();
        
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
    } catch (error) {
      throw error;
  }
}

const testDB = async() => {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers")
    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Calling updateUser on users[0]")
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content"
    });
    console.log("Result:", updatePostResult);
    
    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());