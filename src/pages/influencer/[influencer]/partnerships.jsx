import {
  displayWebsiteLink,
  lookupAd,
  lookupInfluencer,
  updateAd,
  updateInfluencer,
} from "@/actions";
import {
  BoxContainer,
  ConfirmationDialog,
  Label,
  NavigationBar,
  PageBox,
  PageContainer,
} from "@/components";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Head from "next/head";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const InfluencerPartnershipsPage = () => {
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [special, setSpecial] = useState("");

  const [specialty, setSpecialty] = useState([]);
  const [ads, setAds] = useState([]);

  const handlePartenership = (index) => {
    updateAd(
      {
        find: { _id: ads[index]._id },
        update: { accepted: true },
      },
      (response) => {
        if (response.result) {
          ads[index].accepted = true;
          setAds([...ads]);
        } else {
          handleOpen("Failed to build partnership.");
        }
      }
    );
  };

  const handleOpen = (text) => {
    setText(text);
    setOpen(true);
  };

  const handleClose = () => {
    setSpecial("");
    setOpen(false);
  };

  useEffect(() => {
    if (loaded) {
      updateInfluencer(
        {
          find: { name: "@" + params?.influencer ?? "" },
          update: { specialty },
        },
        () => {}
      );
    }
  }, [specialty]);

  useEffect(() => {
    if (params?.influencer) {
      const { influencer } = params;
      lookupInfluencer({ name: "@" + influencer }, (res) => {
        if (res.result) {
          setSpecialty(res.data[0].specialty ?? []);
          lookupAd({ influencer }, (response) => {
            setLoaded(true);
            if (response.result) {
              setAds(response.data);
            } else {
              handleOpen("No ads with the influencers");
            }
          });
        } else {
          handleOpen("Influencer doesn't exist");
        }
      });
    }
  }, [params]);

  return (
    <PageContainer>
      <Head>
        <title>SeeAd Influencer | Update your influencer info here</title>
      </Head>
      <PageBox>
        {loaded && (
          <BoxContainer>
            <NavigationBar
              value={1}
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
            ></NavigationBar>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }} align="center">
                      Action
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Budget</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Target Reach</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Link</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ads.map((ad, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        <h4
                          onClick={() => {
                            if (ad?.accepted)
                              navigator.clipboard.writeText(ads[index].website);
                            else handlePartenership(index);
                            
                            navigator.clipboard.writeText(ads[index].website);
                            setSpecial("Paste the link into your Instagram Bio.");
                            handleOpen("Link is now copied to your clipboard.");
                          }}
                          style={{
                            textDecoration: "underline",
                            color: "blue",
                            cursor: "pointer",
                          }}
                        >
                          {ad?.accepted ? "COPY" : "ACTIVATE"}
                        </h4>
                      </TableCell>
                      <TableCell>{ad.business}</TableCell>
                      <TableCell>${ad.budget ?? 0}</TableCell>
                      <TableCell>10,000+</TableCell>
                      <TableCell>
                        <a href={ad.website}>
                          <nobr>{displayWebsiteLink(ad.website)}</nobr>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <ConfirmationDialog open={open} onClose={handleClose}>
              <Label sx={{ fontWeight: 400 }} text={text} />
              {special.length && <Label sx={{ fontWeight: 400, color: "red" }} text={special} />}
            </ConfirmationDialog>
          </BoxContainer>
        )}
      </PageBox>
    </PageContainer>
  );
};

export default InfluencerPartnershipsPage;
