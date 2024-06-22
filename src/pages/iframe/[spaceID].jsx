import { useRouter } from "next/router";
import { useEffect } from "react";

export default function HTML() {
  let router = useRouter();
  let query = router.query || {};
  let spaceID = query.spaceID;

  useEffect(() => {
    if (!spaceID) {
      return;
    }
    console.log(spaceID);
  }, [spaceID]);

  return (
    <>
      <div>123123123123</div>
    </>
  );
}

//

//

//
