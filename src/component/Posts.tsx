import {
  makeStyles,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Collapse,
  CardActionArea,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import React from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import dayjs from "dayjs";
import Link from "next/link";
import { getS3Image } from "../helper";
import SubLink from "./SubLink";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  card: {
    marginBottom: theme.spacing(2),
  },
}));
function Posts({ data }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <React.Fragment>
      {data?.map((post) => (
        <PostCard post={post} key={post.id}></PostCard>
      ))}
    </React.Fragment>
  );
}

function PostCard({ post }) {
  const classes = useStyles();
  //   const name:string = post.createdBy.name;
  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="recipe"
            className={classes.avatar}
            src={getS3Image(post.createdBy.profileImage, 150, 150)}
          >
            {post.createdBy.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <SubLink subdomain={post.createdBy.name} style={{ color: "#000000" }}>
            {post.createdBy.name}
          </SubLink>
        }
        subheader={dayjs(post.createdAt).format("D MMM hh:mm a")}
      />

      {/* <CardMedia
        className={classes.media}
        image="/static/images/cards/paella.jpg"
        title="Paella dish"
      /> */}
      <Link href="/[slug]" as={`/${post.slug}`} passHref>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {post.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {post.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}

export default Posts;
