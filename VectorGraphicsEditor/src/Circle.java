import java.awt.*;

public class Circle implements Shape {
    private int centerX;
    private int centerY;
    private int radius;
    private int thickness;
    private int[][] brushPattern;
    private Color colour;

    public Circle(int centerX, int centerY, int radius, int thickness, Color colour) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        setThickness(thickness);
        this.colour = colour;
    }

    @Override
    public void draw(Graphics g) {
        int x = 0;
        int y = radius;
        int d = 1 - radius;
        int deltaE = 3;
        int deltaSE = 5 - 2 * radius;
        drawArc(g, x, y);

        while (y > x) {
            if (d < 0) {
                d += deltaE;
                deltaE += 2;
                deltaSE += 2;
            } else {
                d += deltaSE;
                deltaE += 2;
                deltaSE += 4;
                y--;
            }
            x++;
            drawArc(g, x, y);
        }
    }

    private void drawArc(Graphics g, int x, int y) {
        int[] dx = {1, 1, -1, -1, 1, 1, -1, -1};
        int[] dy = {1, -1, 1, -1, 1, -1, 1, -1};

        for (int i = 0; i < dx.length; i++) {
            drawBrush(g, centerX + x * dx[i], centerY + y * dy[i]);
            drawBrush(g, centerX + y * dx[i], centerY + x * dy[i]);
        }
    }

    private void drawBrush(Graphics g, int x, int y) {
        int radius = thickness / 2;
        for (int i = 0; i < thickness; i++) {
            for (int j = 0; j < thickness; j++) {
                if (brushPattern[i][j] == 1) {
                    drawPixel(g, x + i - radius, y + j - radius);
                }
            }
        }
    }

    private void drawPixel(Graphics g, int x, int y) {
        g.fillRect(x, y, 1, 1);
    }

    protected boolean nearPoint(int x, int y) {
        double distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        return Math.abs(distance - radius) < 10;
    }

    protected int getCenterX() {
        return centerX;
    }

    protected void setCenterX(int centerX) {
        this.centerX = centerX;
    }

    protected int getCenterY() {
        return centerY;
    }

    protected void setCenterY(int centerY) {
        this.centerY = centerY;
    }

    protected int getRadius() {
        return radius;
    }

    protected void setRadius(int radius) {
        this.radius = radius;
    }

    @Override
    public int getThickness() {
        return thickness;
    }

    @Override
    public void setThickness(int thickness) {
        this.thickness = thickness;
        int radius = thickness / 2;
        brushPattern = new int[thickness][thickness];

        for (int i = 0; i < thickness; i++) {
            for (int j = 0; j < thickness; j++) {
                if (Math.pow(i - radius, 2) + Math.pow(j - radius, 2) < Math.pow(radius, 2)) {
                    brushPattern[i][j] = 1;
                }
            }
        }
    }

    @Override
    public Color getColour() {
        return colour;
    }

    @Override
    public void setColour(Color colour) {
        this.colour = colour;
    }
}
