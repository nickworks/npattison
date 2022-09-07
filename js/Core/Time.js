const Time = class {
    
    static now = 0;
    static prev = 0;
    static dt = 0;
    static scale = 1;
    static unscaled_dt = 0;
    static delayUpdateFPS = 0;
    static frameRate = 0;

    static tick(t){
        if(t === undefined) t = 0;

        if(Time.scale<0) Time.scale=0;
        Time.now = t;
        Time.unscaled_dt = (t - Time.prev) / 1000;
        Time.dt = Time.unscaled_dt * Time.scale;
        Time.prev = t;
        Time.delayUpdateFPS -= Time.unscaled_dt;
        if(Time.delayUpdateFPS <= 0) {
            Time.frameRate = parseInt(1.0/Time.unscaled_dt);
            Time.delayUpdateFPS=.5;
        }
    };
};