import React, { useEffect, useRef, useState } from "react";
import { ReactMic } from "react-mic";
import WaveSurfer from "wavesurfer";
// import uuidv4 from "uuid/dist/v4";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import ReplayIcon from "@material-ui/icons/Replay";

import { green, red, blue } from "@material-ui/core/colors";

import PauseIcon from "@material-ui/icons/Pause";
import Grid from "@material-ui/core/Grid";

import MicIcon from "@material-ui/icons/Mic";

require('dotenv').config();

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        minWidth: 240,
        margin: "auto",
        transition: "0.3s",
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
        "&:hover": {
            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
        }
    },
    media: {
        width: "100%"
    },
    list: {
        padding: 0
    },
    listItem: {
        //paddingBottom: 0
    },
    buttons: {
        padding: theme.spacing(1)
    },
    controls: {
        minWidth: "100px"
    },
    icon: {
        height: 22,
        width: 22
    },
    avatar: {
        display: "inline-block"
    },
    reactmic: {
        width: "100%",
        height: 100
    },
    wavesurfer: {
        width: "100%",
    }
}));
/*
avatar username ostalo layout sa grid

*/
function AudioPlayer({ pushRes }) {
    const wavesurfer = useRef(null);

    const [record, setRecord] = useState(false);
    const [tempFile, setTempFile] = React.useState(null);

    const [playerReady, setPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!tempFile) return;

        wavesurfer.current = WaveSurfer.create({
            container: "#wavesurfer-id",
            waveColor: "grey",
            progressColor: "tomato",
            height: 100,
            cursorWidth: 1,
            cursorColor: "lightgray",
            barWidth: 2,
            normalize: true,
            responsive: true,
            fillParent: true
        });

        // const wav = require("./12346 3203.ogg");

        // console.log("wav", wav);
        // wavesurfer.current.load(wav);

        wavesurfer.current.on("ready", () => {
            setPlayerReady(true);
        });

        const handleResize = wavesurfer.current.util.debounce(() => {
            wavesurfer.current.empty();
            wavesurfer.current.drawBuffer();
        }, 150);

        wavesurfer.current.on("play", () => setIsPlaying(true));
        wavesurfer.current.on("pause", () => setIsPlaying(false));
        window.addEventListener("resize", handleResize, false);
    }, [tempFile]);

    useEffect(() => {
        console.log("file", tempFile);
        if (tempFile) {
            wavesurfer.current.load(tempFile.blobURL);

            console.log("blob", tempFile.blob);

            // var xhr = new XMLHttpRequest();
            var fd = new FormData();
            var filename = new Date().toISOString();
            fd.append("audio_data", tempFile.blob, filename);
            // xhr.open("POST", "http://127.0.0.1:5000/result", true);
            // xhr.send(fd);
            fetch(process.env.REACT_APP_API_ENDPOINT, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: 'POST',
                body: fd

            }).then(response => response.json())
                .then(json => {
                    console.log(json);
                    pushRes(json)
                });
        }
    }, [tempFile]);

    const togglePlayback = () => {
        if (!isPlaying) {
            wavesurfer.current.play();
        } else {
            wavesurfer.current.pause();
        }
    };

    const stopPlayback = () => wavesurfer.current.stop();

    const classes = useStyles();

    let transportPlayButton;

    if (!isPlaying) {
        transportPlayButton = (
            <IconButton onClick={togglePlayback}>
                <PlayArrowIcon className={classes.icon} />
            </IconButton>
        );
    } else {
        transportPlayButton = (
            <IconButton onClick={togglePlayback}>
                <PauseIcon className={classes.icon} />
            </IconButton>
        );
    }

    const onStop = recordedBlob => {
        setTempFile(recordedBlob);
    };

    const onData = recordedBlob => {
        console.log("chunk of real-time data is: ", recordedBlob);
    };

    const startRecording = () => {
        setTempFile(null);
        setRecord(true);
    };

    const resetRecording = () => {
        setTempFile(null);
    };

    const stopRecording = () => {
        setRecord(false);
    };

    return (    
        <>
            <Card className={classes.card} >
                <Grid container direction="column">
                    <Grid item className="p-2 border-bottom">
                        {tempFile ? (
                            <div className={classes.wavesurfer} id="wavesurfer-id" />
                        ) : (
                            <ReactMic
                                record={record}
                                className={classes.reactmic}
                                onStop={onStop}
                                onData={onData}
                                strokeColor="grey"
                                backgroundColor="white"
                                mimeType="audio/wav"
                            />
                        )}
                    </Grid>
                    <Grid item container justify="center" className={classes.buttons}>
                        <Grid item container direction="row"
                            justifyContent="space-between"
                            alignItems="center" xs={12}>
                            {!record && !tempFile && (
                                <IconButton onClick={startRecording}>
                                    <MicIcon
                                        className={classes.icon}
                                    />
                                </IconButton>
                            )}

                            {!record && tempFile && (
                                <IconButton onClick={resetRecording}>
                                    <ReplayIcon
                                        className={classes.icon}
                                    />
                                </IconButton>
                            )}

                            {record && (
                                <IconButton onClick={stopRecording}>
                                    <MicIcon
                                        style={{ color: red[500] }}
                                        className={classes.icon}
                                    />
                                </IconButton>
                            )}
                            <Grid item>
                            {transportPlayButton}
                            <IconButton onClick={stopPlayback}>
                                    <StopIcon className={classes.icon} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </>
    );
}

export default AudioPlayer;
