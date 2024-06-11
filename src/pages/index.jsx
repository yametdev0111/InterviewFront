import { BoxContainer, ClickButton, PageBox, PageContainer } from "@/components";
import Head from "next/head";
import { useRouter } from "next/router";

const DashboardPage = () => {
  const router = useRouter();

  return (
    <PageContainer>
      <Head>
        <title>SeeAd</title>
      </Head>
      <PageBox>
        <BoxContainer>
          <ClickButton
            text="Influencer"
            onClick={() => router.push("/influencer")}
            fullWidth
          />
          <ClickButton
            text="Business"
            onClick={() => router.push("/business")}
            fullWidth
          />
        </BoxContainer>
      </PageBox>
    </PageContainer>
  );
};

export default DashboardPage;
