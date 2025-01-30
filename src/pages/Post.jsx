import React, {useEffect, useState} from 'react'
import { Link, useNavigate, useParams} from "react-router-dom"
import appwriteService from "../appwrite/config"
import Button from "../components/Button"
import Container from "../components/container/Container"
import parse from "html-react-parser"
import {useSelector} from "react-redux"

function Post() {
  const [post, setpost] = useState(null)
  const {slug} = useParams()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData)
  const isAuthor = post && userData ? post.userId === userData.$id : false
  
  const [error, setError] = useState(null);

   useEffect( () => {
    if(slug){
      appwriteService.getPost(slug).then((post) =>{
        if(post){
          setpost(post)
        }else{
          //navigate("/") //todo
          setError("post not found")
        }
      } )
      .catch(() => setError("Failed to fetch post data"));
    }
  }, [slug ]) // navigate removed


if (error) {
  return <p>Error: {error}</p>;
} //todo

  const deletePost = () =>{
    appwriteService.deletePost(post.$id).then((status) => {
      if (status){
        appwriteService.deleteFile(post.featuredImage);
        navigate("/")
      }
    });
  };
  if (!post) {
    return <p>Loading...</p>; // Fallback while the `post` data is being fetched
  }


  

  return  post ? (
    <div className="py-8">
      <Container>
        <div className="w-full  mb-4 relative
         border rounded-xl p-2 flex justify-center">
           <img  src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} 
          className='rounded-xl '/>
           
          { isAuthor && (
            <div className="absolute right-8 top-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor='bg-green-500'
                className='mr-3 '>Edit</Button>
              </Link>
              <Button bgColor='bg-red-500'
                onClick={deletePost}>Delete</Button>
            </div>
          )}
          
          
         </div>
         <div className="w-full   bg-gray-300 border rounded-md  mb-6 p-5">
          <h1 className="text-2xl text-center font-bold">
            {post.title}</h1>
            <div className="text-blue-950 browser-css">
              {parse(post.content)} 
            </div>
         </div>
      </Container>
    </div>
  ) : null 
}

export default Post