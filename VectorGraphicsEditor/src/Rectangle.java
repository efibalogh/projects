import java.awt.*;
import java.util.ArrayList;

public class Rectangle implements Shape {
    private int x1;
    private int y1;
    private int x2;
    private int y2;
    private int thickness;
    private Color colour;
    private final ArrayList <Point> vertices;
    private final ArrayList <Line> edges;

    public Rectangle(int x1, int y1, int x2, int y2, int thickness, Color colour) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        vertices = new ArrayList<>();
        vertices.add(new Point(x1, y1));
        vertices.add(new Point(x2, y1));
        vertices.add(new Point(x2, y2));
        vertices.add(new Point(x1, y2));
        edges = new ArrayList<>();
        edges.add(new Line(x1, y1, x2, y1, thickness, colour));
        edges.add(new Line(x2, y1, x2, y2, thickness, colour));
        edges.add(new Line(x2, y2, x1, y2, thickness, colour));
        edges.add(new Line(x1, y2, x1, y1, thickness, colour));
        setThickness(thickness);
        this.colour = colour;
    }

    @Override
    public void draw(Graphics g) {
        for (Line edge : edges) {
            edge.draw(g);
        }
    }

    protected boolean nearPoint(int x, int y) {
        for (Line edge : edges) {
            if (edge.nearPoint(x, y)) {
                return true;
            }
        }
        return false;
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

    protected ArrayList <Point> getVertices() {
        return vertices;
    }

    protected ArrayList <Line> getEdges() {
        return edges;
    }

    protected void updateEdges() {
        edges.set(0, new Line(vertices.get(0).x, vertices.get(0).y, vertices.get(1).x, vertices.get(1).y, thickness, colour));
        edges.set(1, new Line(vertices.get(1).x, vertices.get(1).y, vertices.get(2).x, vertices.get(2).y, thickness, colour));
        edges.set(2, new Line(vertices.get(2).x, vertices.get(2).y, vertices.get(3).x, vertices.get(3).y, thickness, colour));
        edges.set(3, new Line(vertices.get(3).x, vertices.get(3).y, vertices.get(0).x, vertices.get(0).y, thickness, colour));
    }

    @Override
    public int getThickness() {
        return thickness;
    }

    @Override
    public void setThickness(int thickness) {
        this.thickness = thickness;

        for (Line edge : edges) {
            edge.setThickness(thickness);
        }
    }

    @Override
    public Color getColour() {
        return colour;
    }

    @Override
    public void setColour(Color colour) {
        this.colour = colour;

        for (Line edge : edges) {
            edge.setColour(colour);
        }
    }
}