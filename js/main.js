(function() {
    var memoryBanner = new adRock({
            urls: 'http://localhost:8080/', // ['href01, href02']
            // insertIn: false,
            // insertBefore: false,
            insertAfter: '.art_hd_tetxt:1', // #id, .class:(0,1,2,3,4)           
            repeat: 48, // hours
            html: `<div class="banner_mozg">
                        <a href=""><img class="banner_moz-img" src="//pridel.net/advimg/banner_x100_mozg.jpg" alt="" title="" /></a>
                        <a class="banner_moz-h" href="">► Память станет лучше в 10 раз✔⚠</a>
                        <a href=""> <p class="banner_moz-p">➨ Вы не поверете всего за один курс....ᐳᐳᐳ</p></a>
                        <br class="clear"/>
                    </div>`,
            css: `.banner_mozg{width:100%;margin-bottom:20px;background:#f9f9f9;padding:20px
                0;border:1px
                solid #1e926b}.banner_moz-img{float:left;padding:0
                20px;width:100%;height:auto;max-width:360px}.banner_moz-h{font-size:26px;color:#ff0909;font-weight:bold;text-decoration:underline}.banner_moz-h:hover{text-decoration:none}.banner_moz-p{font-size:20px;padding:40px
                0;font-weight:bold}.banner_moz-p:hover{text-decoration:underline}`
    });

    memoryBanner.start();
} ());