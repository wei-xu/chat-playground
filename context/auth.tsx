import { useRouter, useSegments } from "expo-router";
import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { useState } from "react";
import { db, FIREBASE_AUTH } from "../config/FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export const AuthContext = React.createContext(null);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: UserCredential) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      console.log(
        `[in auth] user: ${user ? user.user.uid : null} and segments ${
          segments[0]
        }`
      );
      console.log("redirect to sign-in");
      // router.replace("/sign-in");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      console.log(
        `[in auth] user: ${user ? user.user.uid : null} and segments ${
          segments[0]
        }`
      );
      // router.replace("/");
    }
  }, [user, segments]);
}

export function Provider(props: any) {
  const [user, setAuth] = React.useState<UserCredential>();
  const [loadingAuth, setLoadingAuth] = useState(false);

  const doRegister = async (email: string, password: string) => {
    try {
      const user: UserCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      createUserInDB(user);
      console.log("registered user: ", user);
    } catch (error) {
      console.log("there's something wrong ", error);
    }
  };

  const createUserInDB = async (user: UserCredential) => {
    try {
      const docRef = addDoc(collection(db, "users"), {
        email: user.user.email,
      });
    } catch (err) {
      console.error("creating user in db failed, error: ", err);
    }
  };

  const doSignIn = async (email: string, password: string) => {
    try {
      const user = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      setAuth(user);
      console.log("completed signing in", user.user);
    } catch (error) {
      console.log("there's something wrong signing in ", error);
    }
  };

  const doSignOut = async () => {
    try {
      console.log("signing out");
      await signOut(FIREBASE_AUTH);
      setAuth(null);
    } catch (err) {
      console.log("error signing out ", err);
    }
  };

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: doSignIn,
        signOut: doSignOut,
        register: doRegister,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
