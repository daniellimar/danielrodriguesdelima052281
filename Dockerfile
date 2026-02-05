FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --no-fund

COPY . .
RUN npm run build -- --configuration production

FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/*/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
