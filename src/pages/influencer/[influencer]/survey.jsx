import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BoxContainer,
  Label,
  NavigationBar,
  PageBox,
  PageContainer,
  RadioSelector,
} from "@/components";
import { infoInfluencer, ipAddress } from "@/actions";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import Head from "next/head";

const InfluencerSurveyPage = () => {
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [exist, setExist] = useState(false);

  useEffect(() => {
    if (params?.influencer) {
      ipAddress((ip) => {
        infoInfluencer;
      });
    }
  }, [params]);

  return (
    <PageContainer>
      <Head>
        <title>SeeAd Influencer | Update your influencer info here</title>
      </Head>
      <PageBox>
        <BoxContainer>
          <NavigationBar
            value={3}
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

          <Label>Followers Survey</Label>

          <Stack spacing={3}>
            <RadioSelector
              title="Gender"
              defaultValue="female"
              items={[
                { value: "female", label: "Female" },
                { value: "male", label: "Male" },
              ]}
            />

            <RadioSelector
              title="What is your age?"
              defaultValue="13"
              items={[
                { value: "13", label: "13-17" },
                { value: "18", label: "18-22" },
                { value: "23", label: "23-27" },
                { value: "28", label: "28-32" },
                { value: "33", label: "33-37" },
                { value: "38", label: "38-42" },
                { value: "43", label: "43-47" },
                { value: "48", label: "48-52" },
                { value: "53", label: "53-57" },
                { value: "58", label: "58-62" },
                { value: "63", label: "63-67" },
                { value: "68", label: "68+" },
              ]}
            />
          </Stack>
        </BoxContainer>
      </PageBox>
    </PageContainer>
  );
};

export default InfluencerSurveyPage;
