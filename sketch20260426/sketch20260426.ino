/**
 * ESP32-CAM MJPEG 流服务器
 * 浏览器直连：http://10.231.134.200:81/stream
 */
#include "esp_camera.h"
#include <WiFi.h>
#include "esp_http_server.h"

// WiFi
const char* ssid     = "zao的热点";
const char* password = "mgd2006zs";

// ESP32 固定 IP（和电脑在同一个子网）
IPAddress localIP(10, 231, 134, 200);
IPAddress gateway(10, 231, 134, 166);
IPAddress subnet(255, 255, 255, 0);

// 引脚定义 (AI-Thinker ESP32-CAM)
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

#define BOUNDARY "FRAME_BOUNDARY"
static httpd_handle_t server = NULL;

// ==================== MJPEG 流处理器 ====================
static esp_err_t stream_handler(httpd_req_t *req) {
  camera_fb_t *fb = NULL;
  esp_err_t res = ESP_OK;
  char part_buf[128];

  res = httpd_resp_set_type(req, "multipart/x-mixed-replace;boundary=" BOUNDARY);
  if (res != ESP_OK) return res;
  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
  httpd_resp_set_hdr(req, "Cache-Control", "no-cache, no-store, must-revalidate");

  while (res == ESP_OK) {
    fb = esp_camera_fb_get();
    if (!fb) {
      res = ESP_FAIL;
      break;
    }

    // 写 MJPEG 分块头
    int hlen = snprintf(part_buf, sizeof(part_buf),
      "\r\n--" BOUNDARY "\r\n"
      "Content-Type: image/jpeg\r\n"
      "Content-Length: %zu\r\n\r\n", fb->len);

    res = httpd_resp_send_chunk(req, part_buf, hlen);
    if (res == ESP_OK) {
      res = httpd_resp_send_chunk(req, (const char *)fb->buf, fb->len);
    }

    esp_camera_fb_return(fb);
  }

  httpd_resp_send_chunk(req, "\r\n--" BOUNDARY "--\r\n", 24);
  return res;
}

// ==================== 单帧快照（备用） ====================
static esp_err_t frame_handler(httpd_req_t *req) {
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    httpd_resp_send_500(req);
    return ESP_FAIL;
  }

  httpd_resp_set_type(req, "image/jpeg");
  httpd_resp_set_hdr(req, "Cache-Control", "no-cache");
  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");

  esp_err_t res = httpd_resp_send(req, (const char *)fb->buf, fb->len);
  esp_camera_fb_return(fb);
  return res;
}

// ==================== 启动 HTTP 服务器 ====================
void startServer() {
  httpd_config_t cfg = HTTPD_DEFAULT_CONFIG();
  cfg.server_port = 81;
  cfg.lru_purge_enable = true;

  httpd_uri_t stream_uri = {
    .uri = "/stream",
    .method = HTTP_GET,
    .handler = stream_handler,
    .user_ctx = NULL
  };
  httpd_uri_t frame_uri = {
    .uri = "/",
    .method = HTTP_GET,
    .handler = frame_handler,
    .user_ctx = NULL
  };

  if (httpd_start(&server, &cfg) == ESP_OK) {
    httpd_register_uri_handler(server, &frame_uri);
    httpd_register_uri_handler(server, &stream_uri);
  }
}

// ==================== 初始化 ====================
void setup() {
  setCpuFrequencyMhz(240);
  Serial.begin(115200);

  // 摄像头配置
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.xclk_freq_hz = 10000000;     // 10MHz 更稳定
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_QVGA;  // 320x240
  config.jpeg_quality = 10;            // 最高画质（1-63, 越小越好）
  config.fb_count = 2;
  config.grab_mode = CAMERA_GRAB_LATEST;
  config.vflip = 1;  // 摄像头物理倒装，垂直翻转画面

  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("Camera init failed");
    delay(3000);
    ESP.restart();
  }

  // WiFi + 固定 IP
  WiFi.config(localIP, gateway, subnet);
  Serial.printf("Connecting to %s", ssid);
  WiFi.begin(ssid, password);
  WiFi.setSleep(false);  // 关闭省电模式，消除微卡顿
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  // 启动 MJPEG 服务器
  startServer();

  Serial.printf("MJPEG Stream: http://%s:81/stream\n", WiFi.localIP().toString().c_str());
  Serial.printf("Snapshot:     http://%s:81/\n", WiFi.localIP().toString().c_str());
}

void loop() {
  delay(10000);
}
