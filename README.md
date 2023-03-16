## Graphql

Для запуска:
1) установить зависимости: npm i
2) запуск сервера в prod npm run start или в dev npm run dev

1. Для тестирования первой части 
    - npm run test  
     
2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.
```
query{
    memberTypes{
        id,
        discount,
        monthPostsLimit
    }
    posts{
        id,
        userId,
        title,
        content
    },
    profiles{
      id,
      userId,
      memberTypeId,
      avatar,
      sex,
      birthday,
      country,
      street,
      city,
    }
    users{
      id ,
      firstName,
      lastName,
      email,
      subscribedToUserIds,
    }
}
```
2.2. Get user, profile, post, memberType by id - 4 operations in one query.
```
query {
  user(id: "c6ebede7-11dd-4c06-a37f-f4ddbcad05c6") {
      id
      firstName
      email
  }
  profile(id: "504d44f2-f905-49c8-a8a6-797a3505a4c4") {
        avatar
        sex
        birthday
        country
        street
        city
        userId
        memberTypeId
        id
  }
  post(id: "4078dba2-4c49-4a17-8a81-fb1cf6f16dde") {
      id
      title
  }
  memberType(id: "basic") {
      id
      discount
      monthPostsLimit
  }
}
```
2.3. Get users with their posts, profiles, memberTypes.
```
query{
    memberTypes{
        id,
        discount,
        monthPostsLimit
    }
    posts{
        id,
        userId,
        title,
        content
    },
    profiles{
    id,
    userId,
    memberTypeId,
    avatar,
    sex,
    birthday,
    country,
    street,
    city,
    }
    users{
    id: ,
    firstName,
    lastName,
    email,
    subscribedToUserIds,
    }
}
```
2.4. Get user by id with his posts, profile, memberType.
```
query {
  user(id: "dd4fb139-6928-4c06-8e57-aad034dabb5e"){
        id
        firstName
        lastName
        posts {
            id
            title
        }  
        profile {
            avatar
            sex
            birthday
            country
            street
            city
            userId
            memberTypeId
            id
        }         
        memberType{
            id
            discount
            monthPostsLimit
        }
  }
}
```
2.5. Get users with their userSubscribedTo, profile.
```
query {
  users {
      id
      firstName
      lastName
      profile {
          id
          avatar
          birthday
      }
      userSubscribedTo {
          id
          firstName
          lastName
      }
  }
}
```

2.6. Get user by id with his subscribedToUser, posts.
```
query {
  user(id: "dd4fb139-6928-4c06-8e57-aad034dabb5e") {
      id
      firstName
      lastName
      posts {
          id
          content
      }
      subscribedToUser {
          id
          firstName
          lastName
      }
  }
}
```
2.7. Get users with their userSubscribedTo, subscribedToUser (additionally for each user in userSubscribedTo, subscribedToUser add their userSubscribedTo, subscribedToUser).
```
query {
  users {
      id
      firstName
      lastName
      userSubscribedTo {
          id
          firstName
          lastName
      }
      subscribedToUser {
          id
          firstName
          lastName
      }
  }
}
```
2.8. Create user.
```
mutation {
  createUser(input: {
      firstName: "second1",
      lastName: "t",
      email: "gt"
  }) {
    firstName
    lastName
    email
    id
  }
}
```
2.9. Create profile.
```
mutation {
  createProfile(input: {      
          avatar: "img://some.jpg",
          sex: "male",
          birthday: 1234566,
          country: "Belarus",
          street: "street",
          city: "city",
          userId: "dd4fb139-6928-4c06-8e57-aad034dabb5e",
          memberTypeId: "business"
      
  }) {
    avatar
    sex
    birthday
    country
    street
    city
    userId
    memberTypeId
    id
  }
}
```

2.10. Create post.
```
mutation {
  createPost(input: {      
          title: "hello title 2",
          content: "dome text is here",
          userId: "dd4fb139-6928-4c06-8e57-aad034dabb5e",
      
  }) {
    title
    content
    userId
    id
  }
}
```

2.11.InputObjectType for DTOs
 [code](https://github.com/ElenaAlena/nodejs-graphql/blob/dev/src/routes/graphql/schema/types/inputTypes.ts) 
2.12. Update user.
```
mutation {
  updateUser(input: {
      firstName: "another name",
  },id: "b5105af5-e179-48fa-b180-9481084c6040") {
    firstName
    lastName
    email
    id
  }
}
```
2.13. Update profile.
```
mutation {
  updateProfile(input: {
          city: "city2",
  },id: "f32a7616-bd32-4856-8850-cec259c21dd5") {
    avatar
    sex
    birthday
    country
    street
    city
    userId
    memberTypeId
    id
  }
}
```
2.14. Update post.
```
mutation {
  updatePost(input: {      
          title: "hello title 2",
          content: "dome text is here",
      
  },id:"a0756c20-97c7-46f7-83f8-2745d7c4e44c") {
    title
    content
    userId
    id
  }
}
```
2.15. Update memberType.
```
mutation {
  updateMemberType(input: {      
          discount: 5
          monthPostsLimit: 30,
      
  },id: "basic") {
    discount
    monthPostsLimit
    id
  }
}
```
2.16. Subscribe to; unsubscribe from.
```
mutation {
  subscribeTo(  
          id: "33e25e77-fac6-4331-8d46-a9ff214e8c75",
          subscribeToUserId: "93ebe972-0801-4d5d-ba3a-1f0900d3a9d1"      
  ) {
    id
    firstName
    lastName
    subscribedToUserIds
  }
}
```
2.17. InputObjectType for DTOs
 [code](https://github.com/ElenaAlena/nodejs-graphql/blob/dev/src/routes/graphql/schema/types/inputTypes.ts) 

3.1. List where the dataloader was used with links to the lines of code (creation in gql context and call in resolver).
[Подключение](https://github.com/ElenaAlena/nodejs-graphql/blob/dev/src/routes/graphql/index.ts#L43) 
[dataLoaders](https://github.com/ElenaAlena/nodejs-graphql/blob/dev/src/routes/graphql/utils/dataLoaders.ts)
[Использование](https://github.com/ElenaAlena/nodejs-graphql/blob/dev/src/routes/graphql/api/userApi.ts)

4. Limit the complexity of the graphql queries by their depth with graphql-depth-limit package.
4.1. [usage](https://github.com/ElenaAlena/nodejs-graphql/blob/dev/src/routes/graphql/index.ts#L30)
[code](https://github.com/ElenaAlena/nodejs-graphql/blob/dev/src/routes/graphql/utils/validations.ts)
4.2 Specify a POST body of gql query that ends with an error due to the operation of the rule. Depth limit is set to 5.
```
query {
    users {
        id
        subscribedToUser {
            userSubscribedTo {
                subscribedToUser {
                    userSubscribedTo {
                        subscribedToUser {
                            userSubscribedTo {
                                id
                            }
                        }
                    }
                }
            }
        }
    }
}
```

