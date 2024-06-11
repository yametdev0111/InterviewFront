import { createBusiness, ipAddress, lookupBusiness } from "@/actions";
import {
  BoxContainer,
  ClickButton,
  ConfirmationDialog,
  InputBox,
  Label,
  PageBox,
  PageContainer,
  TextMaskCustom,
} from "@/components";
import { Input } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BusinessRegisterPage = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const nameRegExp = /^^[a-zA-Z0-9 ,.'"-:;+@]+$/;
  const namePlaceHolder = "Nike, Inc";
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(true);

  const usernameRegExp = /^[a-zA-Z0-9 ,.'"-:;+@]+$/;
  const usernamePlaceHolder = "Nike";
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(true);

  // const addressRegExp =
  //   /^(\d{1,}) [a-zA-Z0-9\s]+(\,)? [a-zA-Z ]+(\,)? [A-Z]{2} [0-9]{5,6}$/;
  // const addressRegExp = /^([a-zA-Z0-9\s]+),([a-zA-Z\s ]+),([A-Z]{2}) [0-9]{5}$/;
  const addressRegExp = /^[\w\s]+,\s[\w\s]+,\s[A-Za-z]{2}\s\d{5}$/;
  const addressPlaceHolder = "One Bowerman Dr, Beaverton, OR 97005";
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(true);

  const phonePlaceHolder = "(503) 671-6453";
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(true);

  const emailRegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailPlaceHolder = "marketing@nike.com";
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(true);

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
    if (nameError || usernameError || addressError || phoneError || emailError)
      return;
    ipAddress((ip) =>
      createBusiness(
        { name, username, address, phone, email, ip },
        (response) => {
          if (response.result) {
            setRedirectUrl(`/business/${response.data.username}/about`);
            setText("Successfully registered.");
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
    ipAddress((ip) => {
      lookupBusiness({ ip }, (data) => {
        if (data.result && Array.isArray(data.data) && data.data.length)
          router.push(`/business/${data.data[0].username}/about`);
      });
    });
  }, []);

  return (
    <PageContainer>
      <Head>
        <title>SeeAd Business | Register your business here</title>
      </Head>
      <PageBox>
        <BoxContainer>
          <Label>Register your business here !</Label>

          <Label text="Business Name" sx={{ fontWeight: "400", mb: 0 }} />
          <InputBox
            value={name}
            onChange={setName}
            error={nameError}
            setError={setNameError}
            regexp={nameRegExp}
            placeholder={namePlaceHolder}
          />

          <Label text="Business Username" sx={{ fontWeight: "400", mb: 0 }} />
          <InputBox
            value={username}
            onChange={setUsername}
            error={usernameError}
            setError={setUsernameError}
            regexp={usernameRegExp}
            placeholder={usernamePlaceHolder}
          />

          <Label text="Business Address" sx={{ fontWeight: "400", mb: 0 }} />
          <InputBox
            value={address}
            onChange={setAddress}
            error={addressError}
            setError={setAddressError}
            regexp={addressRegExp}
            placeholder={addressPlaceHolder}
          />

          <Label text="Business Phone" sx={{ fontWeight: "400", mb: 0 }} />
          <Input
            value={phone}
            error={phoneError}
            onChange={handleSetPhone}
            id="formatted-text-mask-input"
            inputComponent={TextMaskCustom}
            placeholder={phonePlaceHolder}
            fullWidth
          />

          <Label text="Business Email" sx={{ fontWeight: "400", mb: 0 }} />
          <InputBox
            value={email}
            onChange={setEmail}
            error={emailError}
            setError={setEmailError}
            regexp={emailRegExp}
            placeholder={emailPlaceHolder}
          />

          <ClickButton text="Create Business" onClick={handleSubmit} />

          <ConfirmationDialog open={open} onClose={handleClose}>
            <Label sx={{ fontWeight: 400 }} text={text} />
          </ConfirmationDialog>
        </BoxContainer>
      </PageBox>
    </PageContainer>
  );
};

export default BusinessRegisterPage;
