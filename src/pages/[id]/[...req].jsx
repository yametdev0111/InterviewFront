import { ipAddress, lookupAd, updateAd } from "@/actions";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const RedirectPage = () => {
  const params = useParams();
  const router = useRouter();

  const [exist, setExist] = useState(true);

  useEffect(() => {
    console.log(params?.id);
    if (params?.id) {
      ipAddress((ip) => {
        let req = {
          message: params.id,
          business: params.req[0],
          influencer: params.req.length === 1 ? "" : params.req[1],
        };
        console.log(req);
        lookupAd(req, (response) => {
          setExist(Boolean(response.result & response.data.length));
          if (response.result && response.data.length && (response.data[0].accepted ?? true)) {
            const visits = [...new Set([...response.data[0].visits, ip])];
            updateAd(
              {
                find: { _id: response.data[0]._id },
                update: { visits, clicks: response.data[0].clicks + 1 },
              },
              (res) => {
                console.log(res);
                if (res.result) {
                  router.push(response.data[0].redirect);
                } else {
                  alert("Error occured while promoting");
                }
              }
            );
          }
        });
      });
    }
  }, [params]);

  return <>{!exist && <></>}</>;
};

export default RedirectPage;
