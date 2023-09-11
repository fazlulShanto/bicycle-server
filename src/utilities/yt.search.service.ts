import {searchVideo} from 'usetube';

const ytSearch = async (query:string) => {

   
  const searchResult = await searchVideo(`bicycle ${query} fix`);

//   if(searchResult.videos.length){
    const firstResult = searchResult.videos;

    return firstResult;
//   }

  

};

export default ytSearch;