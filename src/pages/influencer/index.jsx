import { createInfluencer, ipAddress, lookupInfluencer } from "@/actions";
import {
  BoxContainer,
  ClickButton,
  ConfirmationDialog,
  InputBox,
  Label,
  NumericFormatCustom,
  PageBox,
  PageContainer,
} from "@/components";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const InfluencerRegisterPage = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

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

  const phoneRegExp = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  const phonePlaceHolder = "+1 703 555 4368";
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(true);

  const addressRegExp = /^[a-zA-Z\s,.-]+,\s*[a-zA-Z\s,.-]+,\s*[a-zA-Z\s.-]+$/;
  const addressPlaceHolder = "City, State, Country";
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(true);

  const handleClose = () => {
    setOpen(false);
    console.log(redirectUrl);
    if (redirectUrl.length) router.push(redirectUrl);
  };

  const handleSetPhone = (event) => {
    setPhone(event.target.value);
    setPhoneError(event.target.value.length !== 14);
  };

  const handleSubmit = () => {
    if (nameError || followingError || addressError || phoneError || emailError)
      return;
    ipAddress((ip) =>
      createInfluencer(
        { name, following, address, phone, email, ip },
        (response) => {
          if (response.result) {
            setRedirectUrl(`/influencer/${response.data.name.slice(1)}/about`);
            setText(
              "Successfully registered. Your username on See.Ad will be " +
                name.slice(1)
            );
            setOpen(true);
          } else {
            setRedirectUrl(``);
            setText("Registration failed.");
            setOpen(true);
          }
        }
      )
    );
  };

  useEffect(() => {
    setPhoneError(!isValidPhoneNumber(phone));
  }, [phone]);

  useEffect(() => {
    ipAddress((ip) => {
      lookupInfluencer({ ip }, (data) => {
        if (data.result && Array.isArray(data.data) && data.data.length)
          router.push(`/influencer/${data.data[0].name.slice(1)}/about`);
      });
    });
  }, []);

  return (
    <PageContainer>
      <Head>
        <title>SeeAd Influencer | Register your influencer account here</title>
      </Head>
      <PageBox>
        <BoxContainer>
          <Label>Register your influencer account here !</Label>

          <Label text="Instagram Name" sx={{ fontWeight: "400", mb: 0 }} />
          <InputBox
            value={name}
            onChange={setName}
            error={nameError}
            setError={setNameError}
            regexp={nameRegExp}
            placeholder={namePlaceHolder}
          />

          <Label
            text="Instagram Followers Count"
            sx={{ fontWeight: "400", mb: 0 }}
          />
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

          <Label text="Email" sx={{ fontWeight: "400", mb: 0 }} />
          <InputBox
            value={email}
            onChange={setEmail}
            error={emailError}
            setError={setEmailError}
            regexp={emailRegExp}
            placeholder={emailPlaceHolder}
          />

          <Label text="Phone" sx={{ fontWeight: "400", mb: 0 }} />
          <PhoneInput
            defaultCountry="US"
            placeholder={phonePlaceHolder}
            value={phone}
            onChange={setPhone}
          />

          <Label text="Location" sx={{ fontWeight: "400", mb: 0 }} />
          <InputBox
            value={address}
            onChange={setAddress}
            error={addressError}
            setError={setAddressError}
            regexp={addressRegExp}
            placeholder={addressPlaceHolder}
          />

          <ClickButton text="Create Influencer" onClick={handleSubmit} />

          <ConfirmationDialog open={open} onClose={handleClose}>
            <Label sx={{ fontWeight: 400 }} text={text} />
          </ConfirmationDialog>
        </BoxContainer>
      </PageBox>
    </PageContainer>
  );
};

export default InfluencerRegisterPage;
