import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import React, { useEffect } from 'react';

function App() {
  
  async function RedditAPI() {
    const sub = document.getElementById('subreddit').value;
    const response = await fetch(`https://www.reddit.com/r/${sub}.json?sort=hot&limit=10`)
    if (response.status == 200) {
      const posts = await response.json();
    
      DisplayPosts(posts);
    }else{
      DisplayError();
    }
  }

  function DisplayPosts(posts) {
    let redditPosts = [];

      posts.data.children.forEach(element => {
        if(element.data.stickied == false) {
          let pc = new PostContent();
          pc.title = element.data.title;
          pc.id = element.data.id;
          pc.score = element.data.score;
          pc.link = element.data.permalink;
          
          redditPosts.push(pc);
      }
    });


    const element = (
      <div>
        <ul className='container'>
        {redditPosts.map(pc => 
        <li key={pc.id}>
          <h3>Score: {pc.score}</h3>  
           <h2>Title: {pc.title}</h2>
           <h4>Comments: <a href={`https://www.reddit.com${pc.link}`}>link</a></h4>
          <button onClick={() => SaveFav(pc)}>Save Post</button>
          </li>)}
        </ul>
      </div>
    )
      ReactDOM.render(element, document.getElementById('content'));
  }

  function DisplayError(){
    const element = (
      <div>
        <p>Error, not a subreddit</p>
      </div>
    )
    ReactDOM.render(element, document.getElementById('content'));
  }

  function DisplayFavPosts(){
    let redditPosts = [];

    
      Object.keys(localStorage).forEach(function(key){
      let value = JSON.parse(localStorage.getItem(key));
      let pc = new PostContent(value.title, value.id, value.score, value.link);      
      redditPosts.push(pc);
      });
      
  
    const element = (
      <div>
        <ul className='container'>
        {redditPosts.map(pc => 
        <li key={pc.id}>
          <h3>Score: {pc.score}</h3>  
           <h2>Title: {pc.title}</h2>
           <h4>Comments: <a href={`https://www.reddit.com${pc.link}`}>link</a></h4>
          <button onClick={() => RemoveFav(pc)}>Remove Post</button>
          </li>)}
        </ul>
      </div>
    )
    ReactDOM.render(element, document.getElementById('saved'));
  }

  function SaveFav(post){
    localStorage.setItem(post.id, JSON.stringify(post));
    DisplayFavPosts();
  }
  
  function RemoveFav(post){
    localStorage.removeItem(post.id);
    DisplayFavPosts();
  }

  function PostContent(title, id, score, link){
    this.title = title;
    this.id = id;
    this.score = score;
    this.link = link;
  }
  

  useEffect(() =>{
    DisplayFavPosts();
  });

  return (
    <>

    <h1>Reddit Frontend</h1>
    <p>Enter subreddit to search</p>
    <input id="subreddit" type="textbox"></input>
    <button onClick={RedditAPI}>
      Click
      </button>

  </>
  );

}
export default App

