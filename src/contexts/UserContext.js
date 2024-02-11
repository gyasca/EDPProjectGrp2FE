import { createContext } from 'react';

const UserContext = createContext({
  user: null,
  setUser: () => {}
});

export default UserContext;

// import React from "react";
// const UserContext = React.createContext({
//   user: null,
//   setUser: () => {},
// });
// export default UserContext;
