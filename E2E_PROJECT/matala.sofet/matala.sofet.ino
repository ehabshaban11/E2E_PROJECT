#include <Keyboard.h>
#define X_PIN A1
#define Y_PIN A2
#define LEFT_PIN 2
#define RIGHT_PIN 3
#define ATTACK_BUTTON_PIN 6

#define CENTER_THRESHOLD 50
#define DIRECTION_THRESHOLD 200

void setup() {
  Keyboard.begin();
  pinMode(LEFT_PIN, OUTPUT);
  pinMode(RIGHT_PIN, OUTPUT);
  pinMode(ATTACK_BUTTON_PIN, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int xValue = analogRead(X_PIN);
  int yValue = analogRead(Y_PIN);

  if (xValue < CENTER_THRESHOLD && xValue < yValue - DIRECTION_THRESHOLD) {
    digitalWrite(LEFT_PIN, HIGH);
    digitalWrite(RIGHT_PIN, LOW);
    Keyboard.press(KEY_LEFT_ARROW);
    Keyboard.release(KEY_LEFT_ARROW);
  } else if (xValue > CENTER_THRESHOLD && xValue > yValue + DIRECTION_THRESHOLD) {
    digitalWrite(LEFT_PIN, LOW);
    digitalWrite(RIGHT_PIN, HIGH);
    Keyboard.press(KEY_RIGHT_ARROW);
    Keyboard.release(KEY_RIGHT_ARROW);
  } else {
    digitalWrite(LEFT_PIN, LOW);
    digitalWrite(RIGHT_PIN, LOW);
  }

  if (digitalRead(ATTACK_BUTTON_PIN) == LOW) {
    attack();
  }

  delay(100);
}

void attack() {
  digitalWrite(LEFT_PIN, HIGH);
  digitalWrite(RIGHT_PIN, HIGH);
  digitalWrite(LEFT_PIN, LOW);
  digitalWrite(RIGHT_PIN, LOW);

  Keyboard.write('w');
  delay(50);
}
