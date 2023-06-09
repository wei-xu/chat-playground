import { useRouter, useSegments } from "expo-router";
import {
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { FIREBASE_AUTH, db } from "../config/FirebaseConfig";

export const AuthContext = createContext(null);

// This hook can be used to access the user info.
export function useAuth() {
  return useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: UserCredential) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
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
      router.replace("/sign-in");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      console.log(
        `[in auth] user: ${user ? user.user.uid : null} and segments ${
          segments[0]
        }`
      );
      router.replace("/");
    }
  }, [user, segments]);
}

export function Provider(props: any) {
  const [user, setAuth] = useState<UserCredential>();
  const [username, setUsername] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);

  const doRegister = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      const usernameRef = doc(db, "users", username);
      const usernameSnap = await getDoc(usernameRef);

      if (usernameSnap.exists()) {
        // stop registering
        // TODO show error message
        console.log("username exists");
        return Promise.reject(new Error("username exists!"));
      }

      const user: UserCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      console.log("username before registering: ", username);
      return createUserInDB(user); // what if create user with email succeeds but in db fails?
      // console.log("registered user: ", user);
    } catch (error) {
      console.log("there's something wrong ", error);
    }
  };

  const createUserInDB = (user: UserCredential) => {
    const docRef = setDoc(doc(db, "users", username), {
      firebase_uid: user.user.uid,
      email: user.user.email
    });
    console.log("created user in db, docRef: ", docRef);
    return docRef;
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
        username,
        setUsername,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
