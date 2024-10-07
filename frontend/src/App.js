import React from "react";
import PostList from "./components/PostList";
import CreatePost from "./components/CreatePost";

const App = () => {
  return (
    <div>
      <PostList />
      <CreatePost />
    </div>
  );
};

export default App;
