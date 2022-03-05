export default class starline {
    constructor(selector, options = {}) {
        this.selector = selector;
        this.speed = options?.speed||100;
        this.radius = options?.radius||0;
        this.gap = options?.gap||32;
        this.height = options?.height||96;
        this.width = options?.width||128;
        this.mode = 'horizontal';
        this.hoverPause = options?.hoverPause||false;

        if(typeof options.mode === 'string'){
            if(['horizontal', 'vertical'].includes(options.mode.toLowerCase())){
                this.mode = options.mode.toLowerCase();
            }
        }

        // Controller parameters

        this.playState = true; // Current state of the marquee
        this.ima = []; // Array to hold images
        this.imwh = []; // Array to hold adjusted image widths or heights

        this.#init();
    }

    #clip(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();
    }

    // Horizontal Positive Speed

    #canvinitHP(can, ctx, sx, initial, negate) {
        ctx.clearRect(0, 0, can.width, can.height);
        let index = initial;
        let pointerX = sx;

        while(pointerX < can.width){
            if(index === this.imwh.length){
                index = 0;
            }
            
            ctx.save();
            this.#clip(ctx, pointerX, 0, this.imwh[index], can.height, this.radius);
            ctx.drawImage(this.ima[index], pointerX, 0, this.imwh[index], can.height);
            ctx.restore();

            pointerX += this.imwh[index] + this.gap;
            index++;
        }

        requestAnimationFrame(elapsed => {
            let drift = (elapsed - negate) * this.speed / 1000;

            if(this.hoverPause && !this.playState){
                drift = 0;
            }

            let newsx = sx - drift;

            if(newsx <= -(this.imwh[initial] + this.gap)){
                newsx = 0;
                initial++;

                if(initial >= this.imwh.length){
                    initial = 0;
                }
            }

            this.#canvinitHP(can, ctx, newsx, initial, elapsed);
        })
    }

    // Horizontal Negative Speed

    #canvinitHN(can, ctx, sx, initial, negate) {
        ctx.clearRect(0, 0, can.width, can.height);
        let index = initial;
        let pointerX = sx;

        while(pointerX < can.width){
            if(index === this.imwh.length){
                index = 0;
            }
            
            ctx.save();
            this.#clip(ctx, pointerX, 0, this.imwh[index], can.height, this.radius);
            ctx.drawImage(this.ima[index], pointerX, 0, this.imwh[index], can.height);
            ctx.restore();

            pointerX += this.imwh[index] + this.gap;
            index++;
        }

        requestAnimationFrame(elapsed => {
            let drift = (elapsed - negate) * this.speed / 1000;

            if(this.hoverPause && !this.playState){
                drift = 0;
            }

            let newsx = sx - drift;
            
            if(newsx >= this.gap){
                initial--;

                if(initial < 0){
                    initial = this.imwh.length - 1;
                }

                newsx = -this.imwh[initial];
            }

            this.#canvinitHN(can, ctx, newsx, initial, elapsed);
        })
    }

    // Vertical Positive Speed

    #canvinitVP(can, ctx, sy, initial, negate) {
        ctx.clearRect(0, 0, can.width, can.height);
        let index = initial;
        let pointerY = sy;

        while(pointerY < can.height){
            if(index === this.imwh.length){
                index = 0;
            }
            
            ctx.save();
            this.#clip(ctx, 0, pointerY, can.width, this.imwh[index], this.radius);
            ctx.drawImage(this.ima[index], 0, pointerY, can.width, this.imwh[index]);
            ctx.restore();

            pointerY += this.imwh[index] + this.gap;
            index++;
        }

        requestAnimationFrame(elapsed => {
            let drift = (elapsed - negate) * this.speed / 1000;

            if(!this.playState){
                drift = 0;
            }

            let newsy = sy - drift;

            if(newsy <= -(this.imwh[initial] + this.gap)){
                newsy = 0;
                initial++;

                if(initial >= this.imwh.length){
                    initial = 0;
                }
            }

            this.#canvinitVP(can, ctx, newsy, initial, elapsed);
        })
    }

    // Vertical Negative Speed

    #canvinitVN(can, ctx, sy, initial, negate) {
        ctx.clearRect(0, 0, can.width, can.height);
        let index = initial;
        let pointerY = sy;

        while(pointerY < can.height){
            if(index === this.imwh.length){
                index = 0;
            }
            
            ctx.save();
            this.#clip(ctx, 0, pointerY, can.width, this.imwh[index], this.radius);
            ctx.drawImage(this.ima[index], 0, pointerY, can.width, this.imwh[index]);
            ctx.restore();

            pointerY += this.imwh[index] + this.gap;
            index++;
        }

        requestAnimationFrame(elapsed => {
            let drift = (elapsed - negate) * this.speed / 1000;

            if(!this.playState){
                drift = 0;
            }

            let newsy = sy - drift;

            if(newsy > this.gap){
                initial--;

                if(initial < 0){
                    initial = this.imwh.length - 1;
                }

                newsy = -this.imwh[initial];
            }

            this.#canvinitVN(can, ctx, newsy, initial, elapsed);
        })
    }

    #canvinit(can, ctx) {
        requestAnimationFrame(elapsed => {
            switch(this.mode){
                case 'horizontal':
                    if(this.speed >= 0){
                        this.#canvinitHP(can, ctx, 0, 0, elapsed);
                    } else{
                        this.#canvinitHN(can, ctx, 0, 0, elapsed);
                    }
                    break;
                case 'vertical':
                    if(this.speed >= 0){
                        this.#canvinitVP(can, ctx, 0, 0, elapsed);
                    } else{
                        this.#canvinitVN(can, ctx, 0, 0, elapsed);
                    }
                    break;
            }
        });
    }

    #init() {
        try{
            document.querySelectorAll(this.selector).forEach(can => {
                const ctx = can.getContext('2d');
                const imx = can.getAttribute('data-starline-srcset').split(',').map((v) => v.trim());
                let loadCount = 0;

                if(this.mode == 'horizontal'){
                    can.width = can.parentElement.clientWidth;
                    
                    if(typeof this.height == 'number'){
                        can.height = this.height;
                    } else if(typeof this.height == 'string'){
                        const helperDiv = document.createElement('div');
                        helperDiv.style.setProperty('position', 'absolute');
                        helperDiv.style.setProperty('height', this.height);
                        can.parentElement.appendChild(helperDiv);
                        can.height = helperDiv.getBoundingClientRect().height;
                        helperDiv.remove();
                    } else{
                        can.height = 96;
                    }

                    for(let i = 0; i < imx.length; i++){
                        this.ima[i] = new Image();
                        this.ima[i].src = imx[i];
                        this.ima[i].onload = () => {
                            this.imwh[i] = this.ima[i].naturalWidth * can.height / this.ima[i].naturalHeight;
                            loadCount++;

                            if(loadCount === imx.length){
                                this.#canvinit(can, ctx);
                            }
                        }
                    }
                } else{
                    can.height = can.parentElement.clientHeight;

                    if(typeof this.width == 'number'){
                        can.width = this.width;
                    } else if(typeof this.width == 'string'){
                        const helperDiv = document.createElement('div');
                        helperDiv.style.setProperty('position', 'absolute');
                        helperDiv.style.setProperty('width', this.width);
                        can.parentElement.appendChild(helperDiv);
                        can.width = helperDiv.getBoundingClientRect().width;
                        helperDiv.remove();
                    } else{
                        can.width = 128;
                    }

                    for(let i = 0; i < imx.length; i++){
                        this.ima[i] = new Image();
                        this.ima[i].src = imx[i];
                        this.ima[i].onload = () => {
                            this.imwh[i] = this.ima[i].naturalHeight * can.width / this.ima[i].naturalWidth;
                            loadCount++;

                            if(loadCount === imx.length){
                                this.#canvinit(can, ctx);
                            }
                        }
                    }
                }

                if(this.hoverPause){
                    can.addEventListener('mouseenter', () => {
                        this.playState = false;
                    })

                    can.addEventListener('mouseleave', () => {
                        this.playState = true;
                    })
                }
            });

            
            window.addEventListener('resize', () => {
                document.querySelectorAll(this.selector).forEach(el => {
                    if(this.mode === 'horizontal'){
                        el.width = el.parentElement.clientWidth;

                        if(typeof this.height == 'string'){
                            const helperDiv = document.createElement('div');
                            helperDiv.style.setProperty('position', 'absolute');
                            helperDiv.style.setProperty('height', this.height);
                            el.parentElement.appendChild(helperDiv);
                            el.height = helperDiv.getBoundingClientRect().height;
                            helperDiv.remove();

                            for(let i = 0; i < this.ima.length; i++){
                                this.imwh[i] = this.ima[i].naturalWidth * el.height / this.ima[i].naturalHeight;
                            }
                        }
                    } else{
                        el.height = el.parentElement.clientHeight;

                        if(typeof this.width == 'string'){
                            const helperDiv = document.createElement('div');
                            helperDiv.style.setProperty('position', 'absolute');
                            helperDiv.style.setProperty('width', this.width);
                            el.parentElement.appendChild(helperDiv);
                            el.width = helperDiv.getBoundingClientRect().width;
                            helperDiv.remove();

                            for(let i = 0; i < this.ima.length; i++){
                                this.imwh[i] = this.ima[i].naturalHeight * el.width / this.ima[i].naturalWidth;
                            }
                        }
                    }
                })
            });
            
        } catch(e){
            console.error(e);
        }
    }
}