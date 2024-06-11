import {
  createAd,
  displayWebsiteLink,
  lookupAd,
  lookupInfluencer,
  specialtyItems,
} from "@/actions";
import {
  BoxContainer,
  ComboSelector,
  ConfirmationDialog,
  Label,
  NavigationBar,
  PageBox,
  PageContainer,
} from "@/components";
import {
  Input,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Head from "next/head";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const BusinessPartshipsPage = () => {
  const params = useParams();
  const [influencers, setInfluencers] = useState([]);
  const [myAds, setMyAds] = useState([]);
  const [currents, setCurrents] = useState([]);
  const [ads, setAds] = useState([]);

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const handleOpen = (text) => {
    setText(text);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const invite = (index) => {
    createAd(
      {
        business: params.business,
        influencer: influencers[index].name.slice(1),
        accepted: false,
        budget: ads[index]?.budget ?? 0,
        message: myAds[currents[index]].message,
        website:
          myAds[currents[index]].website +
          "/" +
          influencers[index].name.slice(1),
        redirect: myAds[currents[index]].redirect,
        clicks: 0,
        visits: [],
      },
      (response) => {
        if (response.result) {
          ads[index] = response.data;
          setAds([...ads]);
          handleOpen("Invite was successfully sent.");
        } else {
          handleOpen("Failed to send invite");
        }
      }
    );
  };

  const reload = (index, idx) => {
    lookupAd(
      {
        influencer: influencers[index].name.slice(1),
        business: params.business,
        message: myAds[idx].message,
      },
      (response) => {
        if (response.result) {
          ads[index] = response.data[0];
          setAds([...ads]);
        }
      }
    );
  };

  useEffect(() => {
    if (params?.business) {
      lookupAd({ business: params.business }, (res) => {
        if (res.result) {
          const ads = res.data;
          const myAds = ads.filter((ad) => ad.influencer === "");
          setMyAds(myAds);

          lookupInfluencer({}, (response) => {
            if (response.result) {
              const influencers = response.data;
              setInfluencers(influencers);
              setCurrents(influencers.map(() => 0));
              setAds(
                influencers.map(
                  (influencer) =>
                    ads.filter(
                      (ad) =>
                        ad.influencer === influencer.name.slice(1) &&
                        ad.message === (ads[0].message ?? "")
                    )[0] ?? undefined
                )
              );
            } else {
              handleOpen(response.message);
            }
          });
        } else {
          handleOpen(res.message);
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
            value={1}
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

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Influencer</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Followers</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Specialty</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      minWidth: "110px",
                      maxWidth: "110px",
                    }}
                    width="1000px"
                  >
                    Budget
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Campaign</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {influencers.map((influencer, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {
                        <a
                          href={`https://www.instagram.com/${influencer.name.slice(
                            1
                          )}`}
                        >
                          {influencer.name}
                        </a>
                      }
                    </TableCell>
                    <TableCell>
                      {influencer.following.toLocaleString("hi-IN")}
                    </TableCell>
                    <TableCell>{influencer.address}</TableCell>
                    <TableCell>
                      {influencer?.specialty
                        .map(
                          (value) =>
                            specialtyItems
                              .filter((item) => item.value === value)
                              ?.at(0)?.label ?? ""
                        )
                        .filter((value) => value !== "")
                        .map((value) => (
                          <p key={value}>{value}</p>
                        ))}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={ads[index]?.budget ?? "0"}
                        onChange={(event) => {
                          if (ads[index]?.influencer) {
                            return;
                          }
                          ads[index] = {
                            ...ads[index],
                            budget: event.target.value,
                          };
                          setAds([...ads]);
                        }}
                        startAdornment={
                          <InputAdornment position="start">$</InputAdornment>
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <ComboSelector
                        value={currents[index]}
                        onChange={(event) => {
                          currents[index] = event.target.value;
                          setCurrents([...currents]);
                          reload(index, event.target.value);
                        }}
                        items={myAds.map((myAd, idx) => ({
                          value: idx,
                          label: displayWebsiteLink(myAd.website),
                        }))}
                      />
                    </TableCell>
                    <TableCell>
                      {ads[index]?.business ? (
                        ads[index].accepted ? (
                          <h4>LIVE</h4>
                        ) : (
                          <h4>SENT</h4>
                        )
                      ) : (
                        <h4
                          onClick={() => {
                            invite(index);
                          }}
                          style={{
                            textDecoration: "underline",
                            color: "blue",
                            cursor: "pointer",
                          }}
                        >
                          INVITE
                        </h4>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <ConfirmationDialog open={open} onClose={handleClose}>
              <Label sx={{ fontWeight: 400 }} text={text} />
            </ConfirmationDialog>
          </TableContainer>
        </BoxContainer>
      </PageBox>
    </PageContainer>
  );
};

export default BusinessPartshipsPage;
