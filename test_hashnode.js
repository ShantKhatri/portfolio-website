import { getPosts } from './src/lib/hashnode.ts';

getPosts().then(posts => {
  console.log("Posts fetched:", posts.length);
  if (posts.length > 0) {
    console.log(posts[0].title);
  }
}).catch(console.error);
