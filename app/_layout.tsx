import { Stack } from "expo-router";
import { Provider } from "../context/auth";
/* this is top level layout right under app
we should wrap provider context here to apply to the entire app
*/

const Layout = () => {
  return (
    <Provider>
      <Stack>
        <Stack.Screen // this top level screen layout will show in (tabs) screen
          name="(tabs)"
          options={{ headerTitle: "Login Page", headerShown: false }}
        />
        <Stack.Screen name="index" options={{ headerShown: true }} />
        <Stack.Screen
          name="chat/new_group"
          options={{
            headerTitle: "Create New Chat",
          }}
        />
        <Stack.Screen
          name="(auth)/sign-in"
          options={{
            headerTitle: "Sign In",
          }}
        />
        <Stack.Screen
          name="(auth)/register"
          options={{
            headerTitle: "Sign Up",
          }}
        />
      </Stack>
    </Provider>
  );
};

export default Layout;
