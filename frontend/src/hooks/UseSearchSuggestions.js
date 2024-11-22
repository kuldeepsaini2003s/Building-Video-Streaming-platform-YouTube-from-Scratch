import { useEffect } from "react";
import { YOUTUBE_SEARCH_SUGGESTION } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuary, setSuggestion } from "../utils/SearchSlice";

const UseSearchSuggestions = () => {
  const dispatch = useDispatch();

  const searchQuary = useSelector(
    (store) => store.searchSuggestion.searchQuery
  );
  // console.log(searchQuary);

  const getSearchSuggestion = async () => {
    try {
      const data = await fetch(YOUTUBE_SEARCH_SUGGESTION + searchQuary);
      const json = await data.json();
      console.log(json);
      dispatch(setSearchQuary(json[1]));
    } catch (error) {
      console.error("Error fetch search suggestion", error);
    }
  };

  useEffect(() => {
    if (searchQuary) {
      getSearchSuggestion();
    }
  }, [searchQuary]);
};

export default UseSearchSuggestions;
