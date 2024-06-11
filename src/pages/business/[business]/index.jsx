import {
  BoxContainer,
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

const BusinessPage = () => {
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [ads, setAds] = useState([]);

  const handleDelete = (index) => {
    deleteAd({ _id: ads[index]._id }, (response) => {
      if (response.result) {
        setAds(ads.filter((ad, ind) => ind != index));
      }
    });
  };

  useEffect(() => {
    if (params?.business) {
      lookupAd({ business: params.business }, (response) => {
        if (response.result) {
          setAds(response.data);
          setLoaded(true);
        } else {
          console.log(response.message);
        }
      });
    }
  }, [params]);

  return (
    <PageContainer>
      <Head>
        <title>SeeAd Business | Visit all of your ads</title>
      </Head>
      <PageBox>
        <BoxContainer>
          <NavigationBar
            value={2}
            navs={[
              {
                title: "AdCreation",
                link: `/business/${params?.business}/create`,
              },
              {
                title: "Partnerships",
                link: `/business/${params?.business}/partnerships`,
              },
              {
                title: "Dashboard",
                link: `/business/${params?.business}/`,
              },
              {
                title: "About",
                link: `/business/${params?.business}/about`,
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
                          <a href={ad.website}><nobr>{displayWebsiteLink(ad.website)} </nobr></a>
                          <IconButton onClick={() => handleDelete(ind)}>
                            <CloseIcon />
                          </IconButton>
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

export default BusinessPage;
