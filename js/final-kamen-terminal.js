'use strict';

window.onload = () => {
    const cvs = document.getElementById('k-touch-decade');
    const ctx = cvs.getContext('2d');
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    let state = 0;

    const flags = {
        2000: false,
        2001: false,
        2002: false,
        2003: false,
        2004: false,
        2005: false,
        2006: false,
        2007: false,
        2008: false
    };

    class Sprite {
        constructor(centerX, centerY, image) {
            this.centerX = centerX;
            this.centerY = centerY;
            this.angle = 0;
            this.visible = true;
            this.img = image;
        }
    }

    const pngFiles = {
        LED0: 'images/led-0.png',
        LED1: 'images/led-1.png',
        screen: 'images/screen.png'
    };

    const images = {};
    for (let key in pngFiles) {
        images[key] = new Image();
        images[key].src = pngFiles[key];
    }

    const LEDs = {};
    LEDs['2000'] = new Sprite(90, 90, images['LED0']);
    LEDs['2001'] = new Sprite(90, 270, images['LED0']);
    LEDs['2002'] = new Sprite(90, 450, images['LED0']);
    LEDs['2003'] = new Sprite(450, 90, images['LED0']);
    LEDs['2004'] = new Sprite(270, 90, images['LED0']);
    LEDs['2005'] = new Sprite(450, 270, images['LED0']);
    LEDs['2006'] = new Sprite(270, 270, images['LED0']);
    LEDs['2007'] = new Sprite(450, 450, images['LED0']);
    LEDs['2008'] = new Sprite(270, 450, images['LED0']);
    const screen = new Sprite(360, 270, images['screen']);

    const sprites = [];
    for (let key in LEDs) {
        sprites.push(LEDs[key]);
    }
    sprites.push(screen);

    const updateView = () => {
        ctx.clearRect(0, 0, 720, 540);
        for (let spr of sprites) {
            if (spr.visible == true) {
                ctx.save();
                ctx.translate(spr.centerX, spr.centerY);
                ctx.rotate(spr.angle * Math.PI / 180);
                ctx.drawImage(spr.img, -spr.img.width / 2, -spr.img.height / 2);
                ctx.restore();
            }
        }
    };

    const unlockAudioCtx = () => {
        audioCtx.resume().then(() => {
            cvs.removeEventListener('mousedown', unlockAudioCtx);
            cvs.removeEventListener('touchstart', unlockAudioCtx);
            cvs.removeEventListener('touchend', unlockAudioCtx);
        });
    };

    if (audioCtx.state === 'suspended') {
        cvs.addEventListener('mousedown', unlockAudioCtx);
        cvs.addEventListener('touchstart', unlockAudioCtx);
        cvs.addEventListener('touchend', unlockAudioCtx);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            if (audioCtx.state !== 'running') {
                cvs.addEventListener('mousedown', unlockAudioCtx);
                cvs.addEventListener('touchstart', unlockAudioCtx);
                cvs.addEventListener('touchend', unlockAudioCtx);
            }
        }
    });

    const mp3Files = {
        name2000: 'sounds/kuuga.mp3',
        name2001: 'sounds/agito.mp3',
        name2002: 'sounds/ryuki.mp3',
        name2003: 'sounds/faiz.mp3',
        name2004: 'sounds/blade.mp3',
        name2005: 'sounds/hibiki.mp3',
        name2006: 'sounds/kabuto.mp3',
        name2007: 'sounds/den-o.mp3',
        name2008: 'sounds/kiva.mp3',
        attack2000: 'sounds/kamen-ride-ultimate.mp3',
        attack2001: 'sounds/kamen-ride-shining.mp3',
        attack2002: 'sounds/kamen-ride-survive.mp3',
        attack2003: 'sounds/kamen-ride-blaster.mp3',
        attack2004: 'sounds/kamen-ride-king.mp3',
        attack2005: 'sounds/kamen-ride-armed.mp3',
        attack2006: 'sounds/kamen-ride-hyper.mp3',
        attack2007: 'sounds/kamen-ride-rider.mp3',
        attack2008: 'sounds/kamen-ride-emperor.mp3',
        attack: 'sounds/attack.mp3',
        dcd: 'sounds/final-kamen-ride-decade.mp3',
        ppp: 'sounds/ring.mp3',
        reset: 'sounds/reset.mp3'
    };

    const audioBuffers = {};
    const promiseArray = [];

    for (let key in mp3Files) {
        const promise = new Promise((resolve, reject) => {
            fetch(mp3Files[key]).then((response) => {
                if (!response.ok) {
                    throw new Error();
                }
                return response.arrayBuffer();
            }).then((arrayBuffer) => {
                audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
                    audioBuffers[key] = audioBuffer;
                    resolve();
                });
            }).catch(() => {
                console.log('無法讀取 ' + mp3Files[key]);
                let div = document.createElement('div');
                div.textContent = '無法讀取 ' + mp3Files[key];
                cvs.parentNode.parentNode.appendChild(div);
            });
        });

        promiseArray.push(promise);
    }

    Promise.all(promiseArray).then(() => {
        updateView();

        for (let key in images) {
            images[key].onload = () => {
                updateView();
            };
        }

        class Button {
            constructor(x, y, w, h) {
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
                this.enabled = true;
                this.action = () => {};
            }
        }

        const btn2000 = new Button(0, 0, 180, 180);
        const btn2001 = new Button(0, 180, 180, 180);
        const btn2002 = new Button(0, 360, 180, 180);
        const btn2003 = new Button(360, 0, 180, 180);
        const btn2004 = new Button(180, 0, 180, 180);
        const btn2005 = new Button(360, 180, 180, 180);
        const btn2006 = new Button(180, 180, 180, 180);
        const btn2007 = new Button(360, 360, 180, 180);
        const btn2008 = new Button(180, 360, 180, 180);
        const btnDCD = new Button(540, 180, 180, 180);
        const btnF = new Button(540, 0, 180, 180);
        const btnC = new Button(540, 360, 180, 180);

        const turnAllLEDsOn = () => {
            for (let key in LEDs) {
                LEDs[key].img = images['LED1'];
            }
            updateView();
        };
        const turnAllLEDsOff = () => {
            for (let key in LEDs) {
                LEDs[key].img = images['LED0'];
            }
            updateView();
        };
        const highlight = (labels) => {
            for (let key in LEDs) {
                LEDs[key].img = images['LED0'];
            }
            for (let year of labels) {
                LEDs[year].img = images['LED1'];
            }
            updateView();
        };

        let ringtone = null;

        const commonButtonFunc = (year) => {
            switch (state) {
                case 0: {
                    if (!flags[year]) {
                        flags[year] = true;
                        LEDs[year].img = images['LED1'];
                        const source = audioCtx.createBufferSource();
                        source.buffer = audioBuffers['name' + year];
                        source.connect(audioCtx.destination);
                        source.start(0);

                        let b = true;
                        for (let key in flags) {
                            b = (b && flags[key]);
                            if (!b) break;
                        }

                        if (b) {
                            ringtone = audioCtx.createBufferSource();
                            ringtone.buffer = audioBuffers['ppp'];
                            ringtone.connect(audioCtx.destination);
                            ringtone.start(audioCtx.currentTime + 1);

                            const makeSpiral = () => {
                                setTimeout(() => {
                                    highlight(['2000']);
                                }, 0);
                                setTimeout(() => {
                                    highlight(['2001']);
                                }, 100);
                                setTimeout(() => {
                                    highlight(['2002']);
                                }, 200);
                                setTimeout(() => {
                                    highlight(['2008']);
                                }, 300);
                                setTimeout(() => {
                                    highlight(['2007']);
                                }, 400);
                                setTimeout(() => {
                                    highlight(['2005']);
                                }, 500);
                                setTimeout(() => {
                                    highlight(['2003']);
                                }, 600);
                                setTimeout(() => {
                                    highlight(['2004']);
                                }, 700);
                                setTimeout(() => {
                                    highlight(['2006']);
                                }, 800);
                            };

                            setTimeout(() => {
                                makeSpiral();
                                let count = 0;
                                setInterval(() => {
                                    if (count < 9) {
                                        count++;
                                        makeSpiral();
                                    } else {
                                        let id = setTimeout(() => {}, 0);
                                        while (id--) {
                                            clearTimeout(id);
                                            clearInterval(id);
                                        }
                                        turnAllLEDsOff();
                                    }
                                }, 1200);
                            }, 1000);
                        }
                    }

                    break;
                }
                case 2: {
                    for (let key in flags) {
                        flags[key] = false;
                    }

                    flags[year] = true;
                    highlight([year]);
                    const source = audioCtx.createBufferSource();
                    source.buffer = audioBuffers['name' + year];
                    source.connect(audioCtx.destination);
                    source.start(0);

                    break;
                }
            }
        };

        btn2000.action = () => {
            commonButtonFunc('2000');
        };
        btn2001.action = () => {
            commonButtonFunc('2001');
        };
        btn2002.action = () => {
            commonButtonFunc('2002');
        };
        btn2003.action = () => {
            commonButtonFunc('2003');
        };
        btn2004.action = () => {
            commonButtonFunc('2004');
        };
        btn2005.action = () => {
            commonButtonFunc('2005');
        };
        btn2006.action = () => {
            commonButtonFunc('2006');
        };
        btn2007.action = () => {
            commonButtonFunc('2007');
        };
        btn2008.action = () => {
            commonButtonFunc('2008');
        };
        btnDCD.action = () => {
            switch (state) {
                case 0: {
                    let b = true;
                    for (let key in flags) {
                        b = (b && flags[key]);
                        if (!b) break;
                    }

                    if (b) {
                        state = 1;

                        for (let key in flags) {
                            flags[key] = false;
                        }

                        let id = setTimeout(() => {}, 0);
                        while (id--) {
                            clearTimeout(id);
                            clearInterval(id);
                        }
                        turnAllLEDsOn();

                        ringtone.stop();
                        const source = audioCtx.createBufferSource();
                        source.buffer = audioBuffers['dcd'];
                        source.connect(audioCtx.destination);
                        source.start(0);

                        setTimeout(() => {
                            turnAllLEDsOff();
                        }, 2000);
                        setTimeout(() => {
                            turnAllLEDsOn();
                        }, 2500);
                        setTimeout(() => {
                            turnAllLEDsOff();
                        }, 3000);
                        setTimeout(() => {
                            highlight(['2000', '2004', '2003']);
                        }, 3500);
                        setTimeout(() => {
                            highlight(['2001', '2006', '2005']);
                        }, 4000);
                        setTimeout(() => {
                            highlight(['2002', '2008', '2007']);
                        }, 4500);
                        setTimeout(() => {
                            highlight(['2001', '2006', '2005']);
                        }, 5000);
                        setTimeout(() => {
                            highlight(['2000', '2004', '2003']);
                        }, 5500);
                        setTimeout(() => {
                            highlight(['2006']);
                        }, 6000);
                        setTimeout(() => {
                            highlight(['2004']);
                        }, 6200);
                        setTimeout(() => {
                            highlight(['2003']);
                        }, 6400);
                        setTimeout(() => {
                            highlight(['2005']);
                        }, 6600);
                        setTimeout(() => {
                            highlight(['2007']);
                        }, 6800);
                        setTimeout(() => {
                            highlight(['2008']);
                        }, 7000);
                        setTimeout(() => {
                            highlight(['2002']);
                        }, 7200);
                        setTimeout(() => {
                            highlight(['2001']);
                        }, 7400);
                        setTimeout(() => {
                            highlight(['2000']);
                        }, 7600);
                        setTimeout(() => {
                            turnAllLEDsOn();
                        }, 7800);
                        setTimeout(() => {
                            turnAllLEDsOff();
                        }, 8000);
                        setTimeout(() => {
                            turnAllLEDsOn();
                        }, 8200);
                        setTimeout(() => {
                            state = 2;
                        }, 9000);
                    }

                    break;
                }
            }
        };
        btnF.action = () => {
            switch (state) {
                case 2: {
                    let year = null;
                    for (let key in flags) {
                        if (flags[key] == true) {
                            year = key;
                            break;
                        }
                    }

                    if (year != null) {
                        state = 3;

                        for (let key in flags) {
                            flags[key] = false;
                        }

                        const source1 = audioCtx.createBufferSource();
                        source1.buffer = audioBuffers['attack' + year];
                        source1.connect(audioCtx.destination);
                        source1.start(0);

                        setTimeout(() => {
                            const source2 = audioCtx.createBufferSource();
                            source2.buffer = audioBuffers['attack'];
                            source2.connect(audioCtx.destination);
                            source2.start(0);
                        }, 4000);

                        setTimeout(() => {
                            turnAllLEDsOff();
                            LEDs['2003'].img = images['LED1'];
                            LEDs['2005'].img = images['LED1'];
                            LEDs['2007'].img = images['LED1'];
                            updateView();
                        }, 4000);
                        setTimeout(() => {
                            LEDs['2004'].img = images['LED1'];
                            LEDs['2006'].img = images['LED1'];
                            LEDs['2008'].img = images['LED1'];
                            updateView();
                        }, 4500);
                        setTimeout(() => {
                            LEDs['2000'].img = images['LED1'];
                            LEDs['2001'].img = images['LED1'];
                            LEDs['2002'].img = images['LED1'];
                            updateView();
                        }, 5000);
                        setTimeout(() => {
                            highlight(['2000', '2002']);
                        }, 5500);
                        setTimeout(() => {
                            highlight(['2004', '2008']);
                        }, 5800);
                        setTimeout(() => {
                            highlight(['2003', '2007']);
                        }, 6100);
                        setTimeout(() => {
                            highlight(['2005']);
                        }, 6400);
                        setTimeout(() => {
                            highlight(['2006']);
                        }, 6700);
                        setTimeout(() => {
                            highlight(['2001']);
                        }, 7000);
                        setTimeout(() => {
                            turnAllLEDsOn();
                        }, 7300);
                        setTimeout(() => {
                            turnAllLEDsOff();
                        }, 7600);
                        setTimeout(() => {
                            turnAllLEDsOn();
                        }, 7900);
                        setTimeout(() => {
                            state = 2;
                        }, 10000);
                    }

                    break;
                }
            }
        };
        btnC.action = () => {
            switch (state) {
                case 2: {
                    state = 0;
                    turnAllLEDsOff();
                    for (let key in flags) {
                        flags[key] = false;
                    }

                    const source = audioCtx.createBufferSource();
                    source.buffer = audioBuffers['reset'];
                    source.connect(audioCtx.destination);
                    source.start(0);

                    break;
                }
            }
        };

        const buttons = [
            btn2000, btn2001, btn2002,
            btn2003, btn2004, btn2005,
            btn2006, btn2007, btn2008,
            btnDCD, btnF, btnC
        ];

        cvs.addEventListener('mousedown', (e) => {
            const rect = cvs.getBoundingClientRect();
            const mX = e.clientX - rect.left;
            const mY = e.clientY - rect.top;

            for (let btn of buttons) {
                if (btn.enabled == true) {
                    if (btn.x <= mX && mX <= btn.x + btn.w && btn.y <= mY && mY <= btn.y + btn.h) {
                        btn.action();
                    }
                }
            }
            updateView();
        });

        cvs.addEventListener('touchstart', (e) => {
            const rect = cvs.getBoundingClientRect();
            const mX = e.touches[0].clientX - rect.left;
            const mY = e.touches[0].clientY - rect.top;
            e.preventDefault();

            for (let btn of buttons) {
                if (btn.enabled == true) {
                    if (btn.x <= mX && mX <= btn.x + btn.w && btn.y <= mY && mY <= btn.y + btn.h) {
                        btn.action();
                    }
                }
            }
            updateView();
        });
    });
};