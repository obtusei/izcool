import { Button } from "@izcool/ui/components/button";
import Icons from "@izcool/ui/components/icons/index";

type Props = {};

export default function SignUpPage({}: Props) {
  return (
    <div className="flex justify-center p-10">
      <div className="absolute top-10 left-10">
        <Icons.logo fill="red" />
      </div>
      <div className="max-w-7xl flex-col gap-4 w-full p-10">
        <br />
        <div className="flex flex-col items-center justify-center gap-4 ">
          <h1 className="text-3xl font-bold max-w-sm w-full">
            Sign Up with <br /> <span>to start planing</span>{" "}
          </h1>
          <div className="flex flex-col items-center justify-center  w-full gap-4 mt-10">
            <Button variant={"outline"} size={"lg"} className="max-w-sm w-full">
              <Icons.google /> Continue with Google
            </Button>
            <Button variant={"outline"} size={"lg"} className="max-w-sm w-full">
              <Icons.gitHub /> Continue with Github
            </Button>
            <Button variant={"outline"} size={"lg"} className="max-w-sm w-full">
              <Icons.twitter /> Continue with X
            </Button>
            <Button variant={"outline"} size={"lg"} className="max-w-sm w-full">
              <Icons.facebook /> Continue with facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
