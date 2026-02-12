ps aux|grep "carman-website-strapi/web"|grep -v grep|awk '{print $2}'|xargs kill -9
