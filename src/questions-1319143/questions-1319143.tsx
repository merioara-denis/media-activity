import React, { useReducer, useEffect } from "react";
import type { Reducer } from "react";

/* #region api.ts */
const API = {
  getById: async (id: number, abortController: AbortController) => {
    return await (
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        signal: abortController.signal,
      })
    ).json();
  },
};
/* #endregion */

/* #region types.ts */
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

type SetPostAction = { type: "SET_DETAILS"; payload: Post };

type Action =
  | SetPostAction
  | { type: "CLEAR_DETAILS" }
  | { type: "SHOW_LOADER" }
  | { type: "HIDE_LOADER" }
  | { type: string };

interface Store {
  isLoading: boolean;
  details: Post | null;
}

const defaultStore: Store = {
  isLoading: false,
  details: null,
};

interface Props {
  postId: number;
}

interface IGetPostArgs {
  postId: number;
  abortController: AbortController;
  dispatch: React.Dispatch<Action>;
}
/* #endregion */

/* #region utils.ts */
async function getPost(args: IGetPostArgs) {
  const { abortController, postId, dispatch } = args;

  dispatch(actions.showLoader());

  let isRequestLoading = false;
  let timerId: NodeJS.Timeout | undefined = undefined;
  const promiseClose = () => {
    if (timerId) clearTimeout(timerId);

    if (!isRequestLoading) {
      return dispatch(actions.hideLoader());
    }

    timerId = setTimeout(promiseClose, 500);
  };

  try {
    isRequestLoading = true;
    promiseClose();
    const data = await API.getById(postId, abortController);
    dispatch(actions.setDetails(data));
    isRequestLoading = false;
  } catch (err) {
    console.log(err);
    isRequestLoading = false;
    dispatch(actions.clearDetails());
  }
}
/* #endregion */

/* #region reduce.ts */
const reduce: Reducer<Store, Action> = (state: Store, action: Action) => {
  if (action.type === "SET_DETAILS") {
    return { ...state, details: (action as SetPostAction).payload };
  }

  if (action.type === "CLEAR_DETAILS") {
    return { ...state, details: null };
  }

  if (action.type === "SHOW_LOADER") {
    return { ...state, isLoading: true };
  }

  if (action.type === "HIDE_LOADER") {
    return { ...state, isLoading: false };
  }

  return state;
};

const actions = Object.freeze({
  showLoader: () => ({ type: "SHOW_LOADER" }),
  hideLoader: () => ({ type: "HIDE_LOADER" }),
  clearDetails: () => ({ type: "CLEAR_DETAILS" }),
  setDetails: (payload: Post) => ({ type: "SET_DETAILS", payload }),
});
/* #endregion */

/* #region React Component */
const Questions1319143 = (props: Props) => {
  const { postId } = props;
  const [store, dispatch] = useReducer(reduce, defaultStore);
  const { details, isLoading } = store;

  useEffect(() => {
    const abortController = new AbortController();
    getPost({ dispatch, postId, abortController });
    return () => {
      abortController.abort();
    };
  }, [dispatch, postId]);

  return <div>{isLoading ? "loading" : JSON.stringify(details)}</div>;
};

Questions1319143.defaultProps = {
  postId: 1,
};
/* #endregion */

export { Questions1319143 };
