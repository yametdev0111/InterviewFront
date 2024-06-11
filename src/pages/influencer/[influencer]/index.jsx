import {
  BoxContainer,
  ConfirmationDialog,
  Label,
  NavigationBar,
  PageBox,
  PageContainer,
} from "@/components";
import { IconButton, Stack } from "@mui/material";
import Head from "next/head";
import Link from "next/link";

import { deleteAd, displayWebsiteLink, lookupAd } from "@/actions";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";

const InfluencerPage = () => {
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    if (params?.influencer) {
      lookupAd(
        { influencer: params.influencer, accepted: true },
        (response) => {
          if (response.result) {
            console.log(response.data);
            setAds(response.data.filter((ad) => ad.accepted));
            setLoaded(true);
          } else {
            console.log(response.message);
          }
        }
      );
    }
  }, [params]);

  return (
    <PageContainer>
      <Head>
        <title>SeeAd Influencer | Visit all of your ads</title>
      </Head>
      <PageBox>
        <BoxContainer>
          <NavigationBar
            value={2}
            navs={[
              {
                title: "About",
                link: `/influencer/${params?.influencer}/about`,
              },
              {
                title: "Partnerships",
                link: `/influencer/${params?.influencer}/partnerships`,
              },
              {
                title: "Dashboard",
                link: `/influencer/${params?.influencer}/`,
              },
              {
                title: "Survey",
                link: `/influencer/${params?.influencer}/survey`,
              },
            ]}
          />

          {loaded && (
            <>
              {ads.length !== 0 ? (
                <table>
                  <thead>
                    <tr>
                      <td>
                        <b>Clicks</b>
                      </td>
                      <td>
                        <b>Unique</b>
                      </td>
                      <td>
                        <b>Ad URL</b>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((ad, ind) => (
                      <tr key={ind}>
                        <td>{ad.clicks}</td>
                        <td>{ad?.visits?.length ?? 0}</td>
                        <td>
                          <a href={ad.website}>
                            <nobr>{displayWebsiteLink(ad.website)} </nobr>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <>No ads</>
              )}
            </>
          )}
        </BoxContainer>
      </PageBox>
    </PageContainer>
  );
};

export default InfluencerPage;
