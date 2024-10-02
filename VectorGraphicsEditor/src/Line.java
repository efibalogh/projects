import java.awt.*;

public class Line implements Shape {
    private int x1;
    private int y1;
    private int x2;
    private int y2;
    private int thickness;
    private int[][] brushPattern;
    private Color colour;

    public Line(int x1, int y1, int x2, int y2, int thickness, Color colour) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        setThickness(thickness);
        this.colour = colour;
    }

    @Override
    public void draw(Graphics g) {
        int dx = x2 - x1;
        int dy = y2 - y1;
        int steps = Math.max(Math.abs(dx), Math.abs(dy));
        double xInc = (double) dx / steps;
        double yInc = (double) dy / steps;
        double x = x1;
        double y = y1;

        for (int i = 0; i <= steps; i++) {
            drawBrush(g, (int) Math.round(x), (int) Math.round(y));
            x += xInc;
            y += yInc;
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
        double distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        double dot = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / Math.pow(distance, 2);
        double closestX = x1 + dot * (x2 - x1);
        double closestY = y1 + dot * (y2 - y1);
        double distanceToLine = Math.sqrt(Math.pow(closestX - x, 2) + Math.pow(closestY - y, 2));
        return distanceToLine < 10;
    }

    protected int getX1() {
        return x1;
    }

    protected void setX1(int x1) {
        this.x1 = x1;
    }

    protected int getY1() {
        return y1;
    }

    protected void setY1(int y1) {
        this.y1 = y1;
    }

    protected int getX2() {
        return x2;
    }

    protected void setX2(int x2) {
        this.x2 = x2;
    }

    protected int getY2() {
        return y2;
    }

    protected void setY2(int y2) {
        this.y2 = y2;
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
                if (Math.pow(i - radius, 2) + Math.pow(j - radius, 2) <= Math.pow(radius, 2)) {
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
