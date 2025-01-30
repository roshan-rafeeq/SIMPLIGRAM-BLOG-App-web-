import conf from "../conf/conf";
import { Client, Databases, Storage, Query, ID, ImageGravity } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;
  constructor() {
    this.client.setEndpoint(conf.appwriteUrl);
    this.client.setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log(" Appwrite services :: getPost() :: ", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log(" Appwrite services :: getPosts() :: ", error);
      return false;
    }
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId, //why this here?
        }
      );
    } catch (error) {
      console.log(" Appwrite services :: createPost() :: ", error);
      return false;
    }
  }

  async updatePost(slug, { title, content, status, featuredImage }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log(" Appwrite services :: updatePost() :: ", error);
      return false;
    }
  }

  async deletePost(slug) {  
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log(" Appwrite services :: deletePost() :: ", error);
      return false;
    }
  }

// STORAGE  SERVICE
  
async uploadFile(file){
    try {
        return await this.bucket.createFile(conf.appwriteBucketId, 
            ID.unique(),
            file
        )
    } catch (error) {
        console.log(" Appwrite services :: uploadFile() :: ", error);
        return false;
    }
} 

async deleteFile(fileId){
    try {
        await this.bucket.deleteFile(conf.appwriteBucketId, 
            ID.unique(),
            fileId
        )
    } catch (error) {
        console.log(" Appwrite services :: deleteFile() :: ", error);
        return false;
    }
} 

getFilePreview(fileId){
   try {
        
        return this.bucket.getFilePreview(conf.appwriteBucketId,
           fileId ,
          450,
          300,
          ImageGravity.Center,
          80);
        
    } catch (error) {
        console.error("Error fetching file preview:", error);
        return null; // Or a fallback URL
    }
  }
}

const service = new Service();

export default service;