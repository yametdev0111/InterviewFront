import { createAd, ipAddress, regularWebsiteLink } from "@/actions";
import {
  PageContainer,
  Label,
  PageBox,
  BoxContainer,
  InputBox,
  ClickButton,
  ConfirmationDialog,
  NavigationBar,
  CharacterBoard,
} from "@/components";
import { IconButton } from "@mui/material";
import Head from "next/head";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const AdCreationPage = () => {
  const params = useParams();

  const src = [" ", "#", "?", "/", "\\", "%", ":", ";"];
  const dst = ["-", "＃", "︖", "／", "＼", "％", "꞉", ";"];

  // const websiteRegExp =
  //   /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  const websiteRegExp =
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9$–_.+!*‘(),]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9$–_.+!*‘(),/?]*)$/;
  const [website, setWebsite] = useState("");
  const [websiteError, setWebsiteError] = useState(false);

  const messageRegExp = /^[a-zA-Z0-9$@&()!,.=*+-_ ]*$/;
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [newMsg, setNewMsg] = useState("");

  const [display, setDisplay] = useState("");

  const [collapsed, collapse] = useState(false);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const handleInsert = (character) => {
    const item = document.getElementById("promo");
    let cursorPosition = item.selectionStart;
    setMessage(
      message.slice(0, cursorPosition) +
        character +
        message.slice(cursorPosition)
    );
  };

  const handleSubmit = () => {
    if (websiteError || website.length === 0) {
      handleOpen("Please input website link correctly.");
    } else if (message.length === 0) {
      handleOpen("Please input promo message correctly.");
    } else {
      createAd(
        {
          business: params.business,
          influencer: "",
          message:
            newMsg +
            "-".repeat(31 - message.length >= 0 ? 31 - message.length : 0),
          redirect: regularWebsiteLink(website),
          website: regularWebsiteLink(display),
          clicks: 0,
          visits: [],
        },
        (response) => {
          if (response.result) {
            handleOpen("Ad was successfully created.");
          } else {
            handleOpen(response.message);
          }
        }
      );
    }
  };

  const handleOpen = (text) => {
    setText(text);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let newMessage = message;
    src.forEach((s, ind) => {
      newMessage = newMessage.split(src[ind]).join(dst[ind]);
    });
    setNewMsg(newMessage);
    setDisplay(
      "See.Ad/" +
        newMessage +
        "-".repeat(31 - message.length >= 0 ? 31 - message.length : 0) +
        `/${params?.business ?? ""}`
    );
    console.log(messageRegExp.test(message));
    // if (message.length) setMessageError(!messageRegExp.test(message));
    // else setMessageError(false);
  }, [params, message]);

  return (
    <PageContainer>
      <Head>
        <title>SeeAd Business | Create an Ad to promote your website</title>
      </Head>
      <PageBox>
        <BoxContainer>
          <NavigationBar
            value={0}
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
          ></NavigationBar>

          <Label
            text="Insert webpage you want to promote:"
            sx={{ mb: 0, mt: 6 }}
          ></Label>
          <InputBox
            value={website}
            onChange={setWebsite}
            error={websiteError}
            setError={setWebsiteError}
            regexp={websiteRegExp}
            placeholder="www.yourbusiness.com/campaign"
          ></InputBox>
          {websiteError && (
            <Label sx={{ fontWeight: 400, mt: 1, color: "red" }}>
              Insert a wepage address correctly.
            </Label>
          )}

          <Label
            text="Promo message to display in SeeAd url:"
            sx={{ mb: 0, mt: 6 }}
          ></Label>
          <InputBox
            id="promo"
            value={message}
            onChange={setMessage}
            error={messageError}
            setError={setMessageError}
            regexp={messageRegExp}
            placeholder="Type Message"
          ></InputBox>
          <Label sx={{ fontWeight: 400, mt: 1 }}>
            {message.length + " "}
            {message.length > 31 && (
              <span style={{ color: "red" }}>({31 - message.length}) </span>
            )}
            Characters.
            {message.length > 31 && (
              <span style={{ color: "red" }}> (Instagram Bio Limit 31)</span>
            )}
          </Label>

          <Label text="PREVIEW:" sx={{ mb: 0, mt: 6 }} />
          <Label
            text={display}
            sx={{
              fontWeight: 400,
              cursor: "pointer",
              color: "blue",
              fontUnderline: true,
              mt: 1,
            }}
          ></Label>

          <ClickButton text="CREATE" onClick={handleSubmit} />

          <Label sx={{ mt: 6, mb: 2, color: "rgb(191, 191, 191)" }}>
            <IconButton onClick={() => collapse(!collapsed)} size="small" sx={{ background: "rgb(235, 235, 235, 20)" }}>
              {collapsed ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
            </IconButton>
            Usable Characters for Promo Message
          </Label>
          {collapsed && (
            <Label sx={{ fontWeight: 400, mt: 0 }}>
              <CharacterBoard
                onClick={handleInsert}
                style={{ fontSize: "13px" }}
                text="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                space=" "
              />
              <CharacterBoard
                onClick={handleInsert}
                text="abcdefghIjklmnopqrstuvwxyz"
                space=" "
              />
              <CharacterBoard
                onClick={handleInsert}
                text="0123456789$@&()!.,=*+-_"
                space=" "
              />
            </Label>
          )}

          <ConfirmationDialog open={open} onClose={handleClose}>
            <Label sx={{ fontWeight: 400 }} text={text} />
          </ConfirmationDialog>
        </BoxContainer>
      </PageBox>
    </PageContainer>
  );
};

export default AdCreationPage;
