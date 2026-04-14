import { useGoogleLogin } from "@react-oauth/google";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../services/operations/authAPI";
import { setUser } from "../slices/profileSlice";
import { setToken } from "../slices/authSlice";
import { useDispatch } from "react-redux";

const GoogleLoginButton = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const setUser = useSetRecoilState(userAtom);
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult.code);
        console.log(result);
        dispatch(setUser(result.data.data.user));
        const token = result.data.data.accessToken;
        dispatch(setToken(token));
        navigate("/");
      } else {
        console.log(authResult);
        throw new Error(authResult);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    // <Button
    //   text={`${text} with Google`}
    //   size="lg"
    //   varient="google"
    //   onClick={googleLogin}
    //   widthFull={true}
    //   classes=""
    //   startIcon={<GoogleIcon />}
    // />
    <button
      type="button"
      className="flex flex-1 items-center justify-center gap-2.5 rounded-lg border border-[#2C333F] bg-[#161D29] py-2.5 text-sm font-medium text-[#AFB2BF] transition-all hover:border-[#FFD60A] hover:text-white"
      onClick={googleLogin}
    >
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path
          fill="#EA4335"
          d="M5.27 9.76A7.08 7.08 0 0 1 19.07 12c0 .68-.1 1.33-.25 1.96H12v-3.71h7.8c.15.62.24 1.27.24 1.95 0 4.27-2.9 7.5-7.2 7.5A7.5 7.5 0 1 1 12 4.5c2.04 0 3.88.81 5.24 2.12l-2.12 2.12A4.5 4.5 0 0 0 12 7.5a4.5 4.5 0 0 0-4.28 3.09l-2.45-1.83z"
        />
        <path
          fill="#34A853"
          d="M5.27 14.24l2.44-1.9A4.5 4.5 0 0 0 12 16.5a4.47 4.47 0 0 0 3.02-1.15l2.34 1.81A7.5 7.5 0 0 1 5.27 14.24z"
        />
        <path
          fill="#4A90D9"
          d="M19.8 10.22H12v3.71h7.08c-.24 1.2-.92 2.25-1.9 2.97l2.34 1.81A7.47 7.47 0 0 0 21.5 12c0-.61-.07-1.2-.18-1.78h-.02-.01l-.01-.01-.5.01z"
        />
        <path
          fill="#FBBC05"
          d="M5.27 9.76l2.44 1.83A4.5 4.5 0 0 1 12 7.5c1.17 0 2.23.44 3.04 1.15l2.12-2.12A7.5 7.5 0 0 0 4.5 12c0-.69.1-1.36.27-2l.5-1.24z"
        />
      </svg>
      Google
    </button>
  );
});
export default GoogleLoginButton;
