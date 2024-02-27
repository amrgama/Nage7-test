import { Player } from "@lottiefiles/react-lottie-player";
import lottie from "Assets/Lottie/loading.json";

const Loading = () => {
  return <Player src={lottie} autoplay loop style={{ height: "300px" }} />;
};

export default Loading;
