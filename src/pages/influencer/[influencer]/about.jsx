import {
  ipAddress,
  lookupInfluencer,
  specialtyItems,
  updateInfluencer,
} from "@/actions";
import {
  PageContainer,
  PageBox,
  BoxContainer,
  Label,
  InputBox,
  ClickButton,
  ConfirmationDialog,
  NavigationBar,
  NumericFormatCustom,
  CheckSelector,
} from "@/components";
import Head from "next/head";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const InfluencerAboutPage = () => {
  const router = useRouter();
  const params = useParams();
  const [loaded, setLoaded] = useState(false);

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [redirect, setRedirect] = useState("");

  const [specialty, setSpecialty] = useState([]);

  const nameRegExp = /^@[a-zA-Z0-9 ,.'"-:;+@]+$/;
  const namePlaceHolder = "@John123";
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(true);

  const followingRegExp = /^-?(\d{1,3}(,\d{3})*$|\d+$)$/;
  const followingPlaceHolder = "100,000";
  const [following, setFollowing] = useState("");
  const [followingError, setFollowingError] = useState(true);

  const emailRegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailPlaceHolder = "you@gmail.com";
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(true);

  const phonePlaceHolder = "+1 703 555 4368";
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(true);

  const addressRegExp = /^[a-zA-Z\s,.-]+,\s*[a-zA-Z\s,.-]+,\s*[a-zA-Z\s.-]+$/;
  const addressPlaceHolder = "City, State, Country";
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(true);

  const handleClose = () => {
    setOpen(false);
    if (redirect != "") {
      router.push(redirect);
    }
  };

  const handleSubmit = () => {
    if (nameError || followingError || addressError || phoneError || emailError)
      return;
    ipAddress((ip) => {
      updateInfluencer(
        { find: { ip }, update: { name, following, address, phone, email } },
        (response) => {
          if (response.result) {
            setRedirect(``);
            setText("Successfully updated.");
            setOpen(true);
          } else {
            setText("Update failed.");
            setOpen(true);
          }
        }
      );
    });
  };

  useEffect(() => {
    setPhoneError(!isValidPhoneNumber(phone));
  }, [phone]);

  useEffect(() => {
    if (params?.influencer) {
      ipAddress((ip) => {
        lookupInfluencer({ ip }, (data) => {
          if (
            data.result &&
            Array.isArray(data.data) &&
            data.data.length !== 0 &&
            data.data[0].name === "@" + params.influencer
          ) {
            setName(data.data[0].name);
            setNameError(false);
            setFollowing(data.data[0].following);
            setFollowingError(false);
            setAddress(data.data[0].address);
            setAddressError(false);
            setPhone(data.data[0].phone);
            setPhoneError(false);
            setEmail(data.data[0].email);
            setEmailError(false);
            setSpecialty(data.data[0].specialty);
            setLoaded(true);
          }
        });
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
            value={0}
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
              <Label text="Instagram Name" sx={{ mb: 0 }} />
              <InputBox
                value={name}
                onChange={setName}
                error={nameError}
                setError={setNameError}
                regexp={nameRegExp}
                placeholder={namePlaceHolder}
              />

              <Label text="Instagram Followers Count" sx={{ mb: 0 }} />
              <InputBox
                value={following}
                onChange={setFollowing}
                error={followingError}
                setError={setFollowingError}
                regexp={followingRegExp}
                placeholder={followingPlaceHolder}
                InputProps={{
                  inputComponent: NumericFormatCustom,
                }}
              />

              <Label text="Email" sx={{ mb: 0 }} />
              <InputBox
                value={email}
                onChange={setEmail}
                error={emailError}
                setError={setEmailError}
                regexp={emailRegExp}
                placeholder={emailPlaceHolder}
              />

              <Label text="Phone" sx={{ mb: 0 }} />
              <PhoneInput
                international
                defaultCountry="US"
                placeholder={phonePlaceHolder}
                value={phone}
                onChange={(newValue) => {
                  if (newValue) setPhone(newValue);
                }}
                style={{ background: "white" }}
              />

              <Label text="Location" sx={{ mb: 0 }} />
              <InputBox
                value={address}
                onChange={setAddress}
                error={addressError}
                setError={setAddressError}
                regexp={addressRegExp}
                placeholder={addressPlaceHolder}
              />

              <CheckSelector
                title="What kind of content do you mainly make?"
                subtitle="(Select 1 to 5 below):"
                items={specialtyItems}
                value={specialty}
                onChange={setSpecialty}
              ></CheckSelector>

              <ClickButton text="Update" onClick={handleSubmit} />

              <ConfirmationDialog open={open} onClose={handleClose}>
                <Label sx={{ fontWeight: 400 }} text={text} />
              </ConfirmationDialog>
            </>
          )}
        </BoxContainer>
      </PageBox>
    </PageContainer>
  );
};

export default InfluencerAboutPage;
