import { ipAddress, lookupBusiness, updateBusiness } from "@/actions";
import {
  PageContainer,
  PageBox,
  BoxContainer,
  Label,
  InputBox,
  TextMaskCustom,
  ClickButton,
  ConfirmationDialog,
  NavigationBar,
} from "@/components";
import { Stack, Input } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BusinessAboutPage = () => {
  const router = useRouter();
  const params = useParams();
  const [loaded, setLoaded] = useState(false);

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [redirect, setRedirect] = useState("");

  const [_id, set_ID] = useState("");

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
    if (redirect != "") {
      router.push(redirect);
    }
  };

  const handleSetPhone = (event) => {
    setPhone(event.target.value);
    setPhoneError(event.target.value.length !== 14);
  };

  const handleSubmit = () => {
    if (nameError || usernameError || addressError || phoneError || emailError)
      return;
    updateBusiness(
      { find: { _id }, update: { name, username, address, phone, email } },
      (response) => {
        if (response.result) {
          setRedirect(`/business/${response.data.username}/about`);
          setText("Successfully updated.");
          setOpen(true);
        } else {
          setText("Update failed.");
          setOpen(true);
        }
      }
    );
  };

  useEffect(() => {
    if (params?.business) {
      ipAddress((ip) => {
        lookupBusiness({ ip }, (data) => {
          if (
            data.result &&
            Array.isArray(data.data) &&
            data.data.length !== 0 &&
            data.data[0].username === params.business
          ) {
            set_ID(data.data[0]._id);
            setName(data.data[0].name);
            setNameError(false);
            setUsername(data.data[0].username);
            setUsernameError(false);
            setAddress(data.data[0].address);
            setAddressError(false);
            setPhone(data.data[0].phone);
            setPhoneError(false);
            setEmail(data.data[0].email);
            setEmailError(false);
            setLoaded(true);
          }
        });
      });
    }
  }, [params]);

  return (
    <PageContainer>
      <Head>
        <title>SeeAd Business | Update your business info here</title>
      </Head>
      <PageBox>
        <BoxContainer>
          <NavigationBar
            value={3}
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
              <Label text="Business Name" sx={{ mb: 0 }} />
              <InputBox
                value={name}
                onChange={setName}
                error={nameError}
                setError={setNameError}
                regexp={nameRegExp}
                placeholder={namePlaceHolder}
              />

              <Label text="Business Username" sx={{ mb: 0 }} />
              <InputBox
                value={username}
                onChange={setUsername}
                error={usernameError}
                setError={setUsernameError}
                regexp={usernameRegExp}
                placeholder={usernamePlaceHolder}
              />

              <Label text="Business Address" sx={{ mb: 0 }} />
              <InputBox
                value={address}
                onChange={setAddress}
                error={addressError}
                setError={setAddressError}
                regexp={addressRegExp}
                placeholder={addressPlaceHolder}
              />

              <Label text="Business Phone" sx={{ mb: 0 }} />
              <Input
                value={phone}
                error={phoneError}
                onChange={handleSetPhone}
                id="formatted-text-mask-input"
                inputComponent={TextMaskCustom}
                placeholder={phonePlaceHolder}
                fullWidth
              />

              <Label text="Business Email" sx={{ mb: 0 }} />
              <InputBox
                value={email}
                onChange={setEmail}
                error={emailError}
                setError={setEmailError}
                regexp={emailRegExp}
                placeholder={emailPlaceHolder}
              />

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

export default BusinessAboutPage;
